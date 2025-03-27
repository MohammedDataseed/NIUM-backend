import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

import { v4 as uuidv4 } from "uuid";

import axios, { AxiosError } from "axios";
import * as opentracing from "opentracing";
import { Vkyc } from "src/database/models/vkyc.model";
import { OrdersService } from "../order/order.service";
import { Order } from "src/database/models/order.model";

@Injectable()
export class VideokycService {
  private readonly REQUEST_API_URL = "https://api.kyc.idfy.com/sync/profiles";
  private readonly REQUEST_TASK_API_URL = "https://eve.idfy.com/v3/tasks";
  private readonly RETRIEVE_API_URL =
    "https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve";

  private readonly CONFIG_ID = process.env.VKYC_CONFIG_ID; // Get from .env
  private readonly API_KEY = "fbb65739-9015-4d88-b2f5-5057e1b1f07e";
  private readonly ACCOUNT_ID =
    "e1628d9a6e50/7afd3aae-730e-41ff-aa4c-0914ef4dbbe0";
  private readonly logger = new Logger(VideokycService.name);
  private readonly s3: S3Client;

  constructor(
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order,
    @Inject("V_KYC_REPOSITORY")
    private readonly vkycRepository: typeof Vkyc,
    private readonly orderService: OrdersService
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendVideokycRequest(orderId: string): Promise<any> {
    // if (!token || typeof token !== "string") {
    //   console.log("Token Validation Failed:", {
    //     token,
    //     message: "Invalid or missing X-API-Key token",
    //   });
    //   throw new HttpException(
    //     "Invalid or missing X-API-Key token",
    //     HttpStatus.BAD_REQUEST
    //   );
    // }

    this.logger.log(`Processing v-KYC request for order: ${orderId}`);
    console.log("Event: Starting v-KYC request processing", { orderId });

    let orderDetails: any;
    let attemptNumber: number = 1; // Default to first-time attempt
    let currentOrderId: string;

    try {
      const span = opentracing.globalTracer().startSpan("fetch-order-details");
      console.log("Event: Fetching order details", {
        orderId,
        spanId: span.context().toSpanId(),
      });
      orderDetails = await this.orderService.findOne(span, orderId);
      span.finish();

      if (!orderDetails) {
        console.log("Event: Order not found", { orderId });
        throw new HttpException(
          `Order not found: ${orderId}`,
          HttpStatus.NOT_FOUND
        );
      }
      //  console.log("order",orderDetails);

      // ✅ **Check if v-KYC is required** ✅
      if (!orderDetails.dataValues.is_v_kyc_required) {
        console.log("Event: v-KYC not required, skipping request", { orderId });
        return {
          success: false,
          message: "v-KYC is not required for this order.",
        };
      }

      // ✅ **Check how many times the v-KYC has been attempted** ✅
      const previousAttempts = await Vkyc.count({
        where: { partner_order_id: orderId },
      });
      attemptNumber = previousAttempts + 1; // Increment attempt count

      // Log the attempt number
      console.log("Event: Storing v-KYC attempt", { orderId, attemptNumber });

      // Update the currentOrderId with the attempt number (e.g., orderId-1, orderId-2)
      // currentOrderId = `${orderId}-${attemptNumber}`;
      const timestamp = Date.now(); // Get the current timestamp in milliseconds
      currentOrderId = `${orderId}-${timestamp}`; // Append the timestamp to the original orderId
      console.log("Event: Updated orderId for v-KYC", { currentOrderId });

      // Prepare the API request data
      const requestData = {
        reference_id: currentOrderId, // Use the updated orderId with attempt number
        config: {
          id: this.CONFIG_ID,
          overrides: {},
        },
        data: {
          name: {
            first_name: orderDetails?.dataValues?.customer_name, // Populate with the actual name from the orderDetails if needed
          },
          dob: "", // Populate with actual date of birth if available
        },
        payload: {
          security_questions: [
            {
              question: "What is your name?",
              answer: orderDetails?.dataValues?.customer_name,
            },
            {
              question: "What is your contact number ?",
              answer: orderDetails?.dataValues?.customer_phone,
            },
            {
              question: "What is your email id?",
              answer: orderDetails?.dataValues?.customer_email,
            },
          ],
        },
      };

      // Log the request data before sending the request
      console.log(
        "Event: API Request Data",
        JSON.stringify(requestData, null, 2)
      );

      // **Step 1: Make v-KYC request first**
      let responseData: any;
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
        headers: {
          "api-key": this.API_KEY,
          "account-id": this.ACCOUNT_ID,
          "Content-Type": "application/json",
        },
      });
      responseData = response.data;
      console.log("Success Response:", JSON.stringify(responseData, null, 2)); // Log to verify
      // Log the response after receiving it
      console.log(
        "Event: API Response",
        JSON.stringify(response.data, null, 2)
      );

      console.log("Event: v-KYC request sent successfully", {
        orderId,
        response: response.data,
      });

      // ✅ **Store the successful v-KYC response in the database** ✅

      const vkycData = {
        partner_order_id: orderId, // The partner's order ID
        reference_id: currentOrderId, // Updated order ID
        profile_id: response.data.profile_id, // Profile ID from response
        v_kyc_status: "pending", // Set the status as active
        v_kyc_link: response.data.capture_link, // v-KYC link from response
        v_kyc_link_expires: new Date(response.data.capture_expires_at), // Convert expiration time to Date
        v_kyc_link_status: "active", // Set the status as active
        order_id: orderDetails?.dataValues?.id, // Ensure the correct order ID from orderDetails
        attempt_number: attemptNumber, // The attempt number for the request
        created_by: orderDetails?.dataValues?.partner_id, // Use created_by from orderDetails
        updated_by: orderDetails?.dataValues?.partner_id, // Use updated_by from orderDetails
      };

      // Save to vkycs table
      await Vkyc.create(vkycData);
      console.log("Event: v-KYC data stored successfully", {
        orderId,
        vkycData,
      });

      // ✅ **Update the 'orders' table with reference_id and profile_id** ✅

      let is_video_kyc_link_regenerated = false;
      let is_video_kyc_link_regenerated_details: any[] = [];
      if (attemptNumber > 1) {
        is_video_kyc_link_regenerated = true;
        const previousVkycRecords = await Vkyc.findAll({
          where: { partner_order_id: orderId },
          attributes: [
            "reference_id",
            "profile_id",
            "v_kyc_link",
            "v_kyc_link_expires",
            "v_kyc_link_status",
            "attempt_number",
          ],
        });
        is_video_kyc_link_regenerated_details = previousVkycRecords.map(
          (record) => record.toJSON()
        );
      }
      const span2 = opentracing
        .globalTracer()
        .startSpan("update-order-controller");
      const childSpan = span
        .tracer()
        .startSpan("update-v-kyc", { childOf: span2 });
      // Determine v_kyc_link_status and v_kyc_completed_by_customer
      const v_kyc_link_status = responseData.status || "capture_pending"; // Default to capture_pending if missing
      // const v_kyc_completed_by_customer = v_kyc_link_status === "completed" ? "completed" : "pending";
      const v_kyc_completed_by_customer =
        response.data.v_kyc_link_status === "completed" ? true : false;

      try {
        console.log("Event: Updating order with v-kyc details", { orderId });
        await this.orderService.updateOrder(childSpan, orderId, {
          v_kyc_link: response.data.capture_link || null, // v-KYC link from response
          v_kyc_link_expires: new Date(
            response.data.capture_expires_at
          ).toISOString(), // Convert expiration time to Date
          v_kyc_status: "pending", // Set the status as active
          v_kyc_link_status: "active",
          v_kyc_completed_by_customer,
          v_kyc_reference_id: currentOrderId, // Updated reference ID
          v_kyc_profile_id: response.data.profile_id, // Profile ID from response
          is_video_kyc_link_regenerated, // true if attemptNumber > 1
          is_video_kyc_link_regenerated_details, // Array of previous VKYC records
        });

        this.logger.log(`updated order ${orderId} with v-kyc details`);
        console.log("Event: Order updated with v-kyc details", { orderId });
      } catch (error) {
        childSpan.log({ event: "error", message: error.message });
        this.logger.error(
          `Failed to update order ${orderId} with v-kyc details: ${error.message}`,
          error.stack
        );
        console.log("Event: Failed to update order", {
          orderId,
          error: error.message,
        });
        throw new HttpException(
          {
            success: false,
            message: error.message,
            details: "Failed to update order with v-kyc details",
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } finally {
        childSpan.finish();
      }

      // ✅ **Return Response in the Expected Format**
      return {
        success: true,
        message: "v-KYC link generated successfully",
        v_kyc_link: response.data?.capture_link || null,
        v_kyc_link_status: response.data?.status || "capture_pending",
        v_kyc_link_expires: response.data?.capture_expires_at || null,
        v_kyc_status: "pending",
      };
    } catch (error) {
      this.logger.error(
        `Error fetching order details: ${error.message}`,
        error.stack
      );
      console.log("Event: Error fetching order details", {
        orderId,
        error: error.message,
      });

      if (error.response) {
        console.error("Error Response:", error.response.data);
      }

      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: "Failed to generate vkyc",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleEkycRetrieveWebhook(partner_order_id: string): Promise<any> {
    const token = process.env.API_KEY;
    if (!token) {
      throw new HttpException("Missing API key", HttpStatus.BAD_REQUEST);
    }
    if (!partner_order_id) {
      throw new HttpException(
        "Missing required field: partner_order_id",
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.log(
      `Processing VKYC webhook for partner_order_id: ${partner_order_id}`
    );

    const order = await this.orderRepository.findOne({
      where: { partner_order_id },
      include: [{ model: Vkyc, as: "vkycs" }],
    });

    if (!order) {
      this.logger.warn(
        `No order found for partner_order_id: ${partner_order_id}`
      );
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }

    if (!order.is_v_kyc_required) {
      this.logger.log(
        `VKYC not required for partner_order_id: ${partner_order_id}`
      );
      return { success: true, message: "VKYC not required", data: null };
    }

    const vkycRecords = order?.dataValues?.vkycs || [];
    // const vkycRecords = order.vkycs || [];
    if (!vkycRecords.length) {
      this.logger.warn(
        `No VKYC records found for partner_order_id: ${partner_order_id}`
      );
      throw new HttpException("No VKYC records found", HttpStatus.NOT_FOUND);
    }

    const v_kyc_profile_id = order?.dataValues?.v_kyc_profile_id; // Adjust field name if different

    if (!v_kyc_profile_id) {
      throw new HttpException(
        "v_kyc_profile_id not available",
        HttpStatus.BAD_REQUEST
      );
    }
    // Prepare request payload
    const requestData = { request_id: v_kyc_profile_id }; // Creating requestData object with profile_id

    let responseData;
    try {
      responseData = await this.retrieveVideokycData(requestData); // Call the function to retrieve data
      // responseData = await this.retrieveVideokycData({ request_id: v_kyc_profile_id });
    } catch (error) {
      this.logger.error(`Failed to retrieve VKYC data: ${error.message}`);
      throw new HttpException(
        "Failed to retrieve VKYC data",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!responseData) {
      throw new HttpException(
        "VKYC data retrieval returned empty response",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const resources = responseData?.resources || {};

    // Extract profile report document
    // const vkycDocumentsProfileReport =
    //   resources.documents?.find((doc) => doc.type === "profile_report") || null;

    // Extract profile report document URL
    const vkycDocumentsProfileReport =
      resources.documents?.find((doc) => doc.type === "profile_report") || null;
    const vkycDocuments = vkycDocumentsProfileReport?.value || null;
    const profileReportUrl = vkycDocumentsProfileReport?.value || null;

    // // Check expiration and upload to S3 if not expired
    // let profileReportUrlS3: string | null = null;
    // if (profileReportUrl) {
    //   try {
    //     const url = new URL(profileReportUrl);
    //     const expires = url.searchParams.get("Expires");
    //     const expirationTimestamp = expires ? parseInt(expires, 10) * 1000 : null; // Convert to milliseconds
    //     const currentTimestamp = Date.now();

    //     if (expirationTimestamp && expirationTimestamp > currentTimestamp) {
    //       // Download the file
    //       const fileResponse = await axios.get(profileReportUrl, {
    //         responseType: "arraybuffer", // Handle binary data
    //       });
    //       const fileBuffer = Buffer.from(fileResponse.data);

    //       // Upload to S3
    //       profileReportUrlS3 = await this.uploadToS3(fileBuffer.toString("base64"), "application/pdf", `${partner_order_id}/vkyc_documents`);
    //       this.logger.log(`Uploaded profile report to S3: ${profileReportUrlS3}`);
    //     } else {
    //       this.logger.warn(`Profile report URL expired: ${profileReportUrl}`);
    //     }
    //   } catch (error) {
    //     this.logger.error(`Failed to process profile report URL: ${error.message}`);
    //   }
    // }

    // console.log(profileReportUrlS3)

    // Extract images
    const vkycImagesDataSelfie =
      resources.images?.find((img) => img.type === "selfie") || null;
    const vkycImagesDataPan =
      resources.images?.find((img) => img.type === "ind_pan") || null;
    const vkycImagesDataOthers =
      resources.images?.filter((img) => img.type === "others") || [];

    // Extract videos
    const vkycVideosAgent =
      resources.videos?.find((video) => video.attr === "agent") || null;
    const vkycVideosCustomer =
      resources.videos?.find((video) => video.attr === "customer") || null;

    // Ensure resources.text is always an array before calling find()
    const textResources = Array.isArray(resources.text) ? resources.text : [];

    // Extract location, name, and DOB
    const vkycLocation =
      textResources.find((txt) => txt.attr === "location")?.value || null;
    const vkycName =
      textResources.find((txt) => txt.attr === "name")?.value?.first_name ||
      null;
    const vkycDob =
      textResources.find((txt) => txt.attr === "dob")?.value || null;

    // Consolidating extracted data into an object
    const vkycDataResources = {
      partner_order_id: partner_order_id,
      documents: vkycDocuments,
      images: {
        selfie: vkycImagesDataSelfie?.value || null,
        pan: vkycImagesDataPan?.value || null,
        others: vkycImagesDataOthers.map((img) => img.value) || [],
      },
      videos: {
        agent: vkycVideosAgent?.value || null,
        customer: vkycVideosCustomer?.value || null,
      },
    };

    console.log(JSON.stringify(vkycDataResources, null, 2));

    // await this.processAndUploadVKYCFiles(vkycDataResources,`${partner_order_id}/vkyc_documents`);

    // Upload files and get S3 URLs
    const uploadedFiles = await this.processAndUploadVKYCFiles(
      vkycDataResources,
      `${partner_order_id}/vkyc_documents`
    );

    const isCompleted = responseData.status == "completed";
    const isRejected = responseData.reviewer_action == "rejected";
    const isInProgress =
      responseData.status == "in_progress" &&
      responseData.reviewer_action == null;

    let v_kyc_status: string;
    if (responseData.reviewer_action == "rejected") {
      v_kyc_status = "rejected";
    } else if (isCompleted && responseData.reviewer_action == "approved") {
      v_kyc_status = "completed";
    } else if (isInProgress) {
      v_kyc_status = "in_progress"; // Or "pending" if that's your preference
    } else {
      v_kyc_status = "pending"; // Default case
    }
    // "reviewer_action": "rejected",
    const v_kyc_completed_by_customer = isCompleted;
    const v_kyc_customer_completion_date = responseData.profile_data
      ?.completed_at
      ? new Date(responseData.profile_data.completed_at)
      : null;

    if (
      v_kyc_customer_completion_date &&
      isNaN(v_kyc_customer_completion_date.getTime())
    ) {
      this.logger.error(
        `Invalid completed_at value: ${responseData.profile_data.completed_at}`
      );
      throw new HttpException(
        "Invalid completed_at timestamp",
        HttpStatus.BAD_REQUEST
      );
    }
    // const vkycData = {
    //   reference_id: responseData.reference_id || null,
    //   profile_id: v_kyc_profile_id,
    //   partner_order_id: partner_order_id,
    //   v_kyc_status,
    //   v_kyc_link_status: "active",
    //   v_kyc_comments: responseData.status_description?.comments || null,
    //   v_kyc_doc_completion_date: v_kyc_customer_completion_date,
    //   v_kyc_completed_by_customer,
    //   device_info: responseData.device_info || null,
    //   profile_data: responseData.profile_data || null,
    //   performed_by: responseData.profile_data?.performed_by || null,
    //   // resources_documents: responseData.resources?.documents || null,
    //   // resources_images: responseData.resources?.images || null,
    //   // resources_videos: responseData.resources?.videos || null,
    //   resources_documents: uploadedFiles.documents
    //     ? [uploadedFiles.documents]
    //     : [],
    //   resources_images: [
    //     uploadedFiles.images.selfie,
    //     uploadedFiles.images.pan,
    //     ...uploadedFiles.images.others,
    //   ].filter(Boolean), // Remove null/undefined values
    //   resources_videos: {
    //     agent: uploadedFiles.videos.agent,
    //     customer: uploadedFiles.videos.customer,
    //   },
    //   //     resources_documents: uploadedFiles.documents , // S3 URL for document
    //   // resources_images: {
    //   //   selfie: uploadedFiles.images.selfie, // S3 URL for selfie
    //   //   pan: uploadedFiles.images.pan, // S3 URL for PAN
    //   //   others: uploadedFiles.images.others, // S3 URLs for other images
    //   // },
    //   // resources_videos: {
    //   //   agent: uploadedFiles.videos.agent, // S3 URL for agent video
    //   //   customer: uploadedFiles.videos.customer, // S3 URL for customer video
    //   // },
    //   resources_text: responseData.resources?.text || null,
    //   location_info:
    //     responseData.resources?.text?.find((t) => t.attr === "location")
    //       ?.value || null,
    //   reviewer_action: responseData.reviewer_action || null,
    //   tasks: responseData.tasks || null,
    //   status: responseData.status || null,
    //   status_description: responseData.status_description || null,
    //   status_detail: responseData.status_detail || null,
    // };


    const vkycData = {
      reference_id: responseData.reference_id || null,
      profile_id: v_kyc_profile_id,
      partner_order_id: partner_order_id,
      v_kyc_status,
      v_kyc_link_status: "active",
      v_kyc_comments: responseData.status_description?.comments || null,
      v_kyc_doc_completion_date: v_kyc_customer_completion_date,
      v_kyc_completed_by_customer,
      device_info: responseData.device_info || null,
      profile_data: responseData.profile_data || null,
      performed_by: responseData.profile_data?.performed_by || null,
      // resources_documents: uploadedFiles.documents ? [uploadedFiles.documents] : [],
      // resources_images: [
      //   uploadedFiles.images.selfie,
      //   uploadedFiles.images.pan,
      //   ...uploadedFiles.images.others,
      // ].filter(Boolean),
      // resources_videos: [
      //   uploadedFiles.videos.agent,
      //   uploadedFiles.videos.customer,
      // ].filter(Boolean), // Remove null/undefined values
      resources_documents: responseData.resources?.documents || [], // Metadata
  resources_documents_files: uploadedFiles.documents ? [uploadedFiles.documents] : [], // File URLs
  resources_images: responseData.resources?.images || [], // Metadata
  resources_images_files: [
    uploadedFiles.images.selfie,
    uploadedFiles.images.pan,
    ...uploadedFiles.images.others,
  ].filter(Boolean), // File URLs
  resources_videos: responseData.resources?.videos || [], // Metadata
  resources_videos_files: [
    uploadedFiles.videos.agent,
    uploadedFiles.videos.customer,
  ].filter(Boolean), // File URLs
      resources_text: responseData.resources?.text || null,
      location_info: vkycLocation || null,
      reviewer_action: responseData.reviewer_action || null,
      tasks: responseData.tasks || null,
      status: responseData.status || null,
      status_description: responseData.status_description || null,
      status_detail: responseData.status_detail || null,
    };
    console.log(vkycData);
    // // Use upsert with partner_order_id as part of the unique constraint
    // await Vkyc.upsert(vkycData, {
    //   fields: Object.keys(vkycData) as (keyof Vkyc)[],
    //   conflictFields: ["partner_order_id", "profile_id"],
    // });

    const existingVkyc = await Vkyc.findOne({
      where: {
        partner_order_id: vkycData.partner_order_id,
        profile_id: vkycData.profile_id,
      },
    });

    if (existingVkyc) {
      // Update existing record
      await existingVkyc.update(vkycData);
      console.log("Event: v-KYC data updated successfully", {
        partner_order_id,
        vkycData,
      });
    } else {
      // Create new record
      await Vkyc.create(vkycData);
      console.log("Event: v-KYC data stored successfully", {
        partner_order_id,
        vkycData,
      });
    }

    await order.update({
      v_kyc_status,
      v_kyc_customer_completion_date,
      v_kyc_completed_by_customer,
    });

    this.logger.log(
      `Updated Order for partner_order_id: ${partner_order_id} with VKYC status: ${v_kyc_status}`
    );

    return {
      success: true,
      message: "Webhook processed successfully",
      data: responseData,
    };
  }

  async uploadToS3(
    base64Data: string,
    fileType: string,
    folder: string,
    fileName?: string // Make filename optional
  ): Promise<string | null> {
    if (!base64Data) return null; // Skip if no data

    const buffer = Buffer.from(base64Data, "base64");
    const fileExtension = fileType.split("/")[1];

    // Use provided filename or generate a UUID-based name
    const finalFileName = fileName
      ? `${folder}/${fileName}`
      : `${folder}/${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: finalFileName,
      Body: buffer,
      ContentType: fileType,
    };

    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        await this.s3.send(new PutObjectCommand(uploadParams));
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${finalFileName}`;
      } catch (error) {
        attempt++;
        console.error(`S3 Upload Attempt ${attempt} Failed:`, error);
        if (attempt === maxRetries) {
          console.error("S3 Upload Failed after retries:", error);
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000)); // Exponential backoff
      }
    }
  }

  async processAndUploadVKYCFiles(resources: any, pathString: string) {
    console.log(pathString);

    // Helper function to download and upload a file from a URL
    const downloadAndUpload = async (
      url: string,
      fileType: string,
      folder: string,
      fileName: string
    ): Promise<string | null> => {
      if (!url || typeof url !== "string") return null;

      try {
        // Check expiration
        const urlObj = new URL(url);
        const expires = urlObj.searchParams.get("Expires");
        const expirationTimestamp = expires
          ? parseInt(expires, 10) * 1000
          : null;
        const currentTimestamp = Date.now();

        if (expirationTimestamp && expirationTimestamp <= currentTimestamp) {
          this.logger.warn(`URL expired: ${url}`);
          return null;
        }

        // Download the file
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });
        const fileBuffer = Buffer.from(response.data);
        const base64Data = fileBuffer.toString("base64");

        // Upload to S3 with specified filename
        return await this.uploadToS3(base64Data, fileType, folder, fileName);
      } catch (error) {
        this.logger.error(`Failed to process URL ${url}: ${error.message}`);
        return null;
      }
    };

    // Extract and process documents
    const vkycDocuments =
      typeof resources.documents === "string" ? resources.documents : null;

    // Extract images
    const vkycImagesDataSelfie = resources.images?.selfie || null;
    const vkycImagesDataPan = resources.images?.pan || null;
    const vkycImagesDataOthers = Array.isArray(resources.images?.others)
      ? resources.images.others
      : [];

    // Extract videos
    const vkycVideosAgent = resources.videos?.agent || null;
    const vkycVideosCustomer = resources.videos?.customer || null;

    // Upload files to S3 with specific filenames
    const uploadedFiles = {
      documents: vkycDocuments
        ? await downloadAndUpload(
            vkycDocuments,
            "application/pdf",
            `${pathString}/documents`,
            "profile_report.pdf"
          )
        : null,
      images: {
        selfie: vkycImagesDataSelfie
          ? await downloadAndUpload(
              vkycImagesDataSelfie,
              "image/jpeg",
              `${pathString}/images`,
              "selfie.jpg"
            )
          : null,
        pan: vkycImagesDataPan
          ? await downloadAndUpload(
              vkycImagesDataPan,
              "image/jpeg",
              `${pathString}/images`,
              "ind_pan.jpg"
            )
          : null,
        others: await Promise.all(
          vkycImagesDataOthers.map(async (url: string, index: number) => {
            try {
              return url
                ? await downloadAndUpload(
                    url,
                    "image/jpeg",
                    `${pathString}/images`,
                    `others_${index + 1}.jpg`
                  )
                : null;
            } catch (error) {
              this.logger.error(
                `Error uploading other image: ${error.message}`
              );
              return null;
            }
          })
        ),
      },
      videos: {
        agent: vkycVideosAgent
          ? await downloadAndUpload(
              vkycVideosAgent,
              "video/mp4",
              `${pathString}/videos`,
              "agent.mp4"
            )
          : null,
        customer: vkycVideosCustomer
          ? await downloadAndUpload(
              vkycVideosCustomer,
              "video/mp4",
              `${pathString}/videos`,
              "customer.mp4"
            )
          : null,
      },
    };

    console.log("Uploaded Files:", uploadedFiles);

    return uploadedFiles;
  }

  async retrieveVideokycData(requestData: any) {
    try {
      // Construct the URL with the request_id
      const url = `https://api.kyc.idfy.com/profiles/${requestData.request_id}`;

      // Make a GET request with the required headers
      const response = await axios.get(url, {
        headers: {
          "api-key": this.API_KEY,
          "account-id": this.ACCOUNT_ID,
          "Content-Type": "application/json",
          // 'X-API-Key': token,
        },
      });

      console.log("VKYC API Response:", JSON.stringify(response.data, null, 2)); // Log full response

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get Task details for the given request ID
  async getTaskDetails(token: string, requestId: string) {
    try {
      if (!requestId) {
        throw new HttpException(
          "request_id is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const response = await axios.get(
        `${this.REQUEST_TASK_API_URL}?request_id=${requestId}`,
        {
          headers: {
            "api-key": this.API_KEY,
            "account-id": this.ACCOUNT_ID,
            "Content-Type": "application/json",
            "X-API-Key": token,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // General Error Handler
  private handleError(error: AxiosError) {
    const errorMessage =
      error.response?.data || "An error occurred during the request";
    const statusCode =
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(errorMessage, statusCode);
  }
}
