import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import * as fs from "fs";
import * as opentracing from "opentracing";
import axios, { AxiosError } from "axios";
import { GetObjectCommand } from "@aws-sdk/client-s3"; // Add this import
import { PdfService } from "../document-consolidate/document-consolidate.service";
import { PDFDocument } from "pdf-lib";
import { OrdersService } from "../order/order.service";
import { Order } from "src/database/models/order.model";
import { ESign } from "src/database/models/esign.model";
import { Op, Sequelize } from "sequelize";
import { EkycRetrieveRequestDto } from "src/dto/ekyc-request.dto";
// Define interfaces for the API response structure
interface Esign {
  esign_doc_id?: string;
  esign_details?: {
    esign_doc_id?: string;
  };
  createdAt?: Date; // <-- Make it optional
  toJSON: () => object;
}

interface EkycApiResponse {
  action: string;
  completed_at: string;
  // created_at: string;
  group_id: string;
  request_id: string;
  status: "completed" | "failed";
  task_id: string;
  type: string;
  result?: {
    source_output: {
      esign_details: Array<{
        esign_expiry: string | null;
        esign_url: string | null;
        esigner_email: string | null;
        esigner_name: string | null;
        esigner_phone: string | null;
        url_status: boolean;
      }>;
      esign_doc_id: string;
      esigner_details: any | null;
      status: "Success" | string;
    };
  };
  error?: string; // Present in error responses
  message?: string; // Present in error responses
}

@Injectable()
export class EkycService {
  private readonly REQUEST_API_URL =
    "https://eve.idfy.com/v3/tasks/sync/generate/esign_document";
  private readonly REQUEST_TASK_API_URL = "https://eve.idfy.com/v3/tasks";
  private readonly RETRIEVE_API_URL =
    "https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve";
  private readonly API_KEY = "67163d36-d269-11ef-b1ca-feecce57f827";
  private readonly ACCOUNT_ID =
    "9d956848da98/b5d7ded1-218b-4c63-97ea-71ba70f038d3";
  private readonly USER_KEY = "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv"; // Add this
  // private readonly REQUEST_API_URL = process.env.REQUEST_API_URL;
  // private readonly REQUEST_TASK_API_URL = process.env.REQUEST_TASK_API_URL;
  // private readonly RETRIEVE_API_URL = process.env.RETRIEVE_API_URL;
  // private readonly API_KEY = process.env.API_KEY;
  // private readonly ACCOUNT_ID = process.env.ACCOUNT_ID;
  // private readonly USER_KEY = process.env.USER_KEY; // Add this
  private readonly PROFILE_ID = process.env.E_ESIGN_PROFILE_ID; // Add this
  private readonly logger = new Logger(EkycService.name);

  constructor(
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order,
    @Inject("E_SIGN_REPOSITORY")
    private readonly esignRepository: typeof ESign,
    private readonly pdfService: PdfService,
    private readonly orderService: OrdersService
  ) {}

  
  async getMergedPdfBase64(
    orderId: string
  ): Promise<{ base64: string; signedUrl: string }> {
    this.logger.log(`Processing e-KYC request for order: ${orderId}`);

    try {
      const fileList = await this.pdfService.listFilesByFolder(orderId);
      const files =
        fileList.files?.filter((file) => file.name.endsWith(".pdf")) || [];

      if (files.length === 0) {
        throw new HttpException(
          `No valid PDFs found in folder: ${orderId}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Fetch only the merged document
      const mergedFile = files.find((file) =>
        file.name.startsWith("merged_document_")
      );

      if (!mergedFile) {
        throw new HttpException(
          `No merged document found for order: ${orderId}`,
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Found merged document: ${mergedFile.name}`);
      this.logger.log(`Signed URL: ${mergedFile.signed_url}`);

      const response = await axios.get(mergedFile.signed_url, {
        responseType: "arraybuffer",
      });

      const pdfBuffer = Buffer.from(response.data);

      return {
        base64: pdfBuffer.toString("base64"), // Base64 encoding
        signedUrl: mergedFile.signed_url, // Include signed URL
      };
    } catch (error) {
      this.logger.error(
        `Failed to process PDFs: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: `Failed to process PDFs for order: ${orderId}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMergedPdfBase64W(orderId: string): Promise<string> {
    this.logger.log(`Processing e-KYC request for order: ${orderId}`);

    try {
      const fileList = await this.pdfService.listFilesByFolder(orderId);
      const files =
        fileList.files?.filter((file) => file.name.endsWith(".pdf")) || [];

      if (files.length === 0) {
        throw new HttpException(
          `No valid PDFs found in folder: ${orderId}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Fetch only the merged document
      const mergedFile = files.find((file) => file.name.startsWith("merge_"));

      if (!mergedFile) {
        throw new HttpException(
          `No merged document found for order: ${orderId}`,
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Found merged document: ${mergedFile.name}`);
      this.logger.log(`Found merged document: ${mergedFile.signed_url}`);

      const response = await axios.get(mergedFile.signed_url, {
        responseType: "arraybuffer",
      });
      // const esignFile = Buffer.from(response.data).toString("base64");
      // // Directly use response.data (Buffer)
      // const pdfBuffer = Buffer.from(response.data);
      // this.logger.log(`Fetched Base64 for merged document: ${mergedFile.name}`);
      // const filePath = `./downloaded2_${mergedFile.name}`;

      // // Save file
      // fs.writeFileSync(filePath, pdfBuffer);

      // this.logger.log(`PDF downloaded successfully: ${filePath}`);

      // // Return Base64 only once
      // return pdfBuffer.toString("base64");

      const pdfBuffer = Buffer.from(response.data);
      return pdfBuffer.toString("base64"); // Ensure this is the only encoding step
    } catch (error) {
      this.logger.error(
        `Failed to process PDFs: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: `Failed to process PDFs for order: ${orderId}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendEkycRequest(
    orderId: string,
    partnerHashedApiKey: string,
    partnerHashedKey: string
  ): Promise<any> {
    console.log("Received Headers:", {
      partnerHashedApiKey,
      partnerHashedKey,
    });
    this.logger.log(`Processing e-KYC request for order: ${orderId}`);
    console.log("Event: Starting e-KYC request processing", { orderId });

    let orderDetails: any;

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
      // console.log(orderDetails);
      // ✅ **Check if e-Sign is required** ✅
      if (!orderDetails.dataValues.is_esign_required) {
        console.log("Event: e-Sign not required, skipping request", {
          orderId,
        });
        return {
          success: false,
          message: "e-Sign is not required for this order.",
        };
      }

      this.logger.log(`Fetched order details successfully for ${orderId}`);
      console.log("Event: Order details fetched", { orderId, orderDetails });
    } catch (error) {
      this.logger.error(
        `Error fetching order details: ${error.message}`,
        error.stack
      );
      console.log("Event: Error fetching order details", {
        orderId,
        error: error.message,
      });
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: "Failed to fetch order details",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log("Event: Generating merged PDF", { orderId });
    const { base64: mergedPdfBase64, signedUrl } =
      await this.getMergedPdfBase64(orderId);

    // const mergedPdfBase64 = await this.getMergedPdfBase64(orderId); // Updated method called here
    console.log("Event: Merged PDF generated", {
      orderId,
      mergedPdfLength: mergedPdfBase64.length,
    });
    // const mergedPdfBase64 = await this.generateAndMergePdfBase64(orderId);
    // console.log("Event: Merged PDF generated", { orderId, mergedPdfLength: mergedPdfBase64.length });

    // **Prepare Request Payload**
    const requestData = {
      task_id: orderDetails.dataValues.partner_order_id,
      group_id: orderDetails.dataValues.partner_id,
      order_id: orderId,
      data: {
        flow_type: "PDF",
        user_key: this.USER_KEY,
        verify_aadhaar_details: false,
        esign_file_details: {
          esign_profile_id: this.PROFILE_ID,
          file_name: `${orderDetails.dataValues.partner_order_id}`,
          esign_file: mergedPdfBase64,
          esign_fields: {
            esign_fields: orderDetails.dataValues.esign_fields || {},
          },
          esign_additional_files:
            orderDetails.dataValues.esign_additional_files || [],
          esign_allow_fill: orderDetails.dataValues.esign_allow_fill || false,
        },
        esign_stamp_details: {
          esign_stamp_series: "",
          esign_series_group: "",
          esign_stamp_value: "",
        },
        esign_invitees: [
          {
            esigner_name: orderDetails.dataValues.customer_name,
            esigner_email: orderDetails.dataValues.customer_email,
            esigner_phone: orderDetails.dataValues.customer_phone,
            aadhaar_esign_verification: {
              aadhaar_pincode: "",
              aadhaar_yob: "",
              aadhaar_gender: "",
            },
          },
        ],
      },
    };

    const logData = {
      ...requestData,
      // data: {
      //   ...requestData.data,
      //   esign_file_details: {
      //     ...requestData.data.esign_file_details,
      //     esign_file: mergedPdfBase64.substring(0, 20) + "...",
      //   },
      // },
    };
    this.logger.log("Final Request Payload:");
    console.log("Request Data:", JSON.stringify(logData, null, 2));

    // **Step 1: Make e-KYC request first**
    let responseData: any;
    try {
      console.log("Event: Sending e-KYC request", {
        orderId,
        url: this.REQUEST_API_URL,
      });
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
        headers: {
          "api-key": this.API_KEY,
          "account-id": this.ACCOUNT_ID,
          "Content-Type": "application/json",
        },
      });
      responseData = response.data;
      console.log("Success Response:", JSON.stringify(responseData, null, 2)); // Log to verify
      this.logger.log(`e-KYC API request completed for order: ${orderId}`);
      console.log("Success Response:", JSON.stringify(responseData, null, 2));
    } catch (error) {
      this.logger.error(
        `e-KYC API Error: ${
          error.response ? JSON.stringify(error.response.data) : error.message
        }`
      );
      this.logger.error(
        `Error in e-KYC API request: ${error.message}`,
        error.stack
      );

      let errorMessage = error.message;
      let errorDetails = null;
      let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      if (error.response) {
        const { status, data } = error.response;
        errorMessage = data.message || "e-KYC request failed";
        errorDetails = data;
        httpStatus = status || HttpStatus.INTERNAL_SERVER_ERROR;
      } else {
        errorMessage = "Network error: Unable to reach e-KYC service";
        errorDetails = error.message;
        httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
      }

      console.log("Failure Response:", {
        errorMessage,
        errorDetails: errorDetails || { error: errorMessage },
        httpStatus,
      });

      const previousAttempts = await ESign.count({
        where: { partner_order_id: orderId },
      });
      const attemptNumber = previousAttempts + 1;
      console.log("Event: Storing failed e-KYC attempt", {
        orderId,
        attemptNumber,
      });

      // In sendEkycRequest method, inside the ESign.create call
      await ESign.create({
        partner_order_id: orderId,
        attempt_number: attemptNumber,
        task_id: requestData.task_id,
        group_id: requestData.group_id,
        esign_file_details: {
          ...requestData.data.esign_file_details,
        },
        esign_stamp_details: requestData.data.esign_stamp_details,
        esign_invitees: requestData.data.esign_invitees,
        status:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success"
            ? "completed"
            : "failed",
        esign_details: responseData.result?.source_output || responseData,
        esign_doc_id: responseData.result?.source_output?.esign_doc_id || null, // Should work if present
        request_id: responseData.request_id || null,
        completed_at: responseData.status == "completed" ? new Date() : null,
        esign_expiry: responseData.result?.source_output?.expiry || null,
        active:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success",
        expired: false,
        rejected: false,
      });

      throw new HttpException(
        { success: false, message: errorMessage, details: errorDetails },
        httpStatus
      );
    }

    // **Step 2: Calculate the attempt number**
    const previousAttempts = await ESign.count({
      where: { partner_order_id: orderId },
    });
    const attemptNumber = previousAttempts + 1;
    console.log("Event: Calculated attempt number", { orderId, attemptNumber });

    // **Step 3: Store both request and response data in ESign**
    let esignRecord: ESign;
    try {
      console.log("Event: Storing e-KYC data in ESign", { orderId });
      esignRecord = await ESign.create({
        // partner_order_id: orderId,
        order_id: orderDetails.dataValues.id, // Use Order table's primary key (UUID)
        partner_order_id: orderId, // This is BMFORDERID001
        attempt_number: attemptNumber,
        task_id: requestData.task_id,
        group_id: requestData.group_id,
        // esign_file_details: requestData.data.esign_file_details,
        esign_file_details: {
          ...requestData.data.esign_file_details,
          esign_file: signedUrl,
        },
        esign_stamp_details: requestData.data.esign_stamp_details,
        esign_invitees: requestData.data.esign_invitees,
        status:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success"
            ? "completed"
            : "failed",
        esign_details: responseData.result?.source_output || responseData,
        esign_doc_id: responseData.result?.source_output?.document_id || null,
        request_id: responseData.request_id || null,
        completed_at: responseData.status === "completed" ? new Date() : null,
        esign_expiry: responseData.result?.source_output?.expiry || null,
        active:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success",
        expired: false,
        rejected: false,
      });

      this.logger.log(
        `Saved e-KYC request and response data to ESign model for order: ${orderId}`
      );
      console.log("Event: ESign record saved", {
        orderId,
        esignRecord: esignRecord.toJSON(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to save e-KYC request and response data: ${error.message}`,
        error.stack
      );
      console.log("Event: Failed to save ESign record", {
        orderId,
        error: error.message,
      });
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: "Failed to save e-KYC request and response data",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // **Step 4: Extract and update e-sign details in order**
    const esignDetails =
      responseData.result?.source_output?.esign_details || [];
    const validEsign = esignDetails.find((esign) => esign.url_status === true);
    console.log("Event: Extracted e-sign details", { orderId, validEsign });

    if (validEsign) {
      const span = opentracing
        .globalTracer()
        .startSpan("update-order-controller");
      const childSpan = span
        .tracer()
        .startSpan("update-e-sign", { childOf: span });

      try {
        console.log("Event: Updating order with e-sign details", { orderId });
        // Dynamic status based on signing state
        const requestDetail = {
          is_active: validEsign.url_status, // true
          is_signed: false, // No signing confirmation yet
          is_expired: validEsign.esign_expiry
            ? new Date(validEsign.esign_expiry) < new Date()
            : false, // false
          is_rejected: false, // No rejection
        };

        let eSignStatus: string;
        const { is_active, is_signed, is_expired, is_rejected } = requestDetail;

        if (is_active && is_signed) {
          eSignStatus = "completed";
        } else if (is_active && !is_expired && !is_rejected && !is_signed) {
          eSignStatus = "pending"; // This applies here
        } else if (is_expired && !is_rejected) {
          eSignStatus = "expired";
        } else if (is_rejected || (is_active && is_expired)) {
          eSignStatus = "rejected";
        } else {
          eSignStatus = "pending";
        }
        await this.orderService.updateOrder(childSpan, orderId, {
          e_sign_status: eSignStatus,
          e_sign_link: validEsign.esign_url,
          e_sign_link_status: "active",
          e_sign_link_expires: validEsign.esign_expiry
            ? new Date(validEsign.esign_expiry).toISOString() // Use actual expiry
            : null,
          e_sign_link_doc_id: responseData.result?.source_output?.esign_doc_id,
          e_sign_link_request_id: responseData?.request_id,
          partner_hashed_api_key: partnerHashedApiKey,
          partner_hashed_key: partnerHashedKey,
        });

        this.logger.log(`updated order ${orderId} with e-sign details`);
        console.log("Event: Order updated with e-sign details", { orderId });
      } catch (error) {
        childSpan.log({ event: "error", message: error.message });
        this.logger.error(
          `Failed to update order ${orderId} with e-sign details: ${error.message}`,
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
            details: "Failed to update order with e-sign details",
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } finally {
        childSpan.finish();
      }
    }

    // **Step 5: Return response based on API result**
    if (
      responseData.status === "completed" &&
      responseData.result?.source_output?.status === "Success"
    ) {
      this.logger.log(
        `e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`
      );
      console.log("Event: e-KYC request succeeded", {
        orderId,
        requestId: responseData.request_id,
      });
      return {
        success: true,
        data: responseData,
        message: "e-KYC document generation completed successfully",
      };
    } else {
      this.logger.warn(
        `e-KYC request completed with unexpected status for order: ${orderId}`,
        responseData
      );
      console.log("Event: Unexpected e-KYC response", {
        orderId,
        responseData,
      });
      throw new HttpException(
        {
          success: false,
          message: responseData,
          details: "Unexpected e-KYC response",
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async sendEkycRequestChecker(orderId: string): Promise<any> {
    this.logger.log(`Processing e-KYC request for order: ${orderId}`);
    console.log("Event: Starting e-KYC request processing", { orderId });

    let orderDetails: any;

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
      // console.log(orderDetails);
      // ✅ **Check if e-Sign is required** ✅
      if (!orderDetails.dataValues.is_esign_required) {
        console.log("Event: e-Sign not required, skipping request", {
          orderId,
        });
        return {
          success: false,
          message: "e-Sign is not required for this order.",
        };
      }

      this.logger.log(`Fetched order details successfully for ${orderId}`);
      console.log("Event: Order details fetched", { orderId, orderDetails });
    } catch (error) {
      this.logger.error(
        `Error fetching order details: ${error.message}`,
        error.stack
      );
      console.log("Event: Error fetching order details", {
        orderId,
        error: error.message,
      });
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: "Failed to fetch order details",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log("Event: Generating merged PDF", { orderId });
    const { base64: mergedPdfBase64, signedUrl } =
      await this.getMergedPdfBase64(orderId);

    // const mergedPdfBase64 = await this.getMergedPdfBase64(orderId); // Updated method called here
    console.log("Event: Merged PDF generated", {
      orderId,
      mergedPdfLength: mergedPdfBase64.length,
    });
    // const mergedPdfBase64 = await this.generateAndMergePdfBase64(orderId);
    // console.log("Event: Merged PDF generated", { orderId, mergedPdfLength: mergedPdfBase64.length });

    // **Prepare Request Payload**
    const requestData = {
      task_id: orderDetails.dataValues.partner_order_id,
      group_id: orderDetails.dataValues.partner_id,
      order_id: orderId,
      data: {
        flow_type: "PDF",
        user_key: this.USER_KEY,
        verify_aadhaar_details: false,
        esign_file_details: {
          esign_profile_id: this.PROFILE_ID,
          file_name: `${orderDetails.dataValues.partner_order_id}`,
          esign_file: mergedPdfBase64,
          esign_fields: {
            esign_fields: orderDetails.dataValues.esign_fields || {},
          },
          esign_additional_files:
            orderDetails.dataValues.esign_additional_files || [],
          esign_allow_fill: orderDetails.dataValues.esign_allow_fill || false,
        },
        esign_stamp_details: {
          esign_stamp_series: "",
          esign_series_group: "",
          esign_stamp_value: "",
        },
        esign_invitees: [
          {
            esigner_name: orderDetails.dataValues.customer_name,
            esigner_email: orderDetails.dataValues.customer_email,
            esigner_phone: orderDetails.dataValues.customer_phone,
            aadhaar_esign_verification: {
              aadhaar_pincode: "",
              aadhaar_yob: "",
              aadhaar_gender: "",
            },
          },
        ],
      },
    };

    const logData = {
      ...requestData,
      // data: {
      //   ...requestData.data,
      //   esign_file_details: {
      //     ...requestData.data.esign_file_details,
      //     esign_file: mergedPdfBase64.substring(0, 20) + "...",
      //   },
      // },
    };
    this.logger.log("Final Request Payload:");
    console.log("Request Data:", JSON.stringify(logData, null, 2));

    // **Step 1: Make e-KYC request first**
    let responseData: any;
    try {
      console.log("Event: Sending e-KYC request", {
        orderId,
        url: this.REQUEST_API_URL,
      });
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
        headers: {
          "api-key": this.API_KEY,
          "account-id": this.ACCOUNT_ID,
          "Content-Type": "application/json",
        },
      });
      responseData = response.data;
      console.log("Success Response:", JSON.stringify(responseData, null, 2)); // Log to verify
      this.logger.log(`e-KYC API request completed for order: ${orderId}`);
      console.log("Success Response:", JSON.stringify(responseData, null, 2));
    } catch (error) {
      this.logger.error(
        `e-KYC API Error: ${
          error.response ? JSON.stringify(error.response.data) : error.message
        }`
      );
      this.logger.error(
        `Error in e-KYC API request: ${error.message}`,
        error.stack
      );

      let errorMessage = error.message;
      let errorDetails = null;
      let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      if (error.response) {
        const { status, data } = error.response;
        errorMessage = data.message || "e-KYC request failed";
        errorDetails = data;
        httpStatus = status || HttpStatus.INTERNAL_SERVER_ERROR;
      } else {
        errorMessage = "Network error: Unable to reach e-KYC service";
        errorDetails = error.message;
        httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
      }

      console.log("Failure Response:", {
        errorMessage,
        errorDetails: errorDetails || { error: errorMessage },
        httpStatus,
      });

      const previousAttempts = await ESign.count({
        where: { partner_order_id: orderId },
      });
      const attemptNumber = previousAttempts + 1;
      console.log("Event: Storing failed e-KYC attempt", {
        orderId,
        attemptNumber,
      });

      // In sendEkycRequest method, inside the ESign.create call
      await ESign.create({
        partner_order_id: orderId,
        attempt_number: attemptNumber,
        task_id: requestData.task_id,
        group_id: requestData.group_id,
        esign_file_details: {
          ...requestData.data.esign_file_details,
        },
        esign_stamp_details: requestData.data.esign_stamp_details,
        esign_invitees: requestData.data.esign_invitees,
        status:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success"
            ? "completed"
            : "failed",
        esign_details: responseData.result?.source_output || responseData,
        esign_doc_id: responseData.result?.source_output?.esign_doc_id || null, // Should work if present
        request_id: responseData.request_id || null,
        completed_at: responseData.status === "completed" ? new Date() : null,
        esign_expiry: responseData.result?.source_output?.expiry || null,
        active:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success",
        expired: false,
        rejected: false,
      });

      throw new HttpException(
        { success: false, message: errorMessage, details: errorDetails },
        httpStatus
      );
    }

    // **Step 2: Calculate the attempt number**
    const previousAttempts = await ESign.count({
      where: { partner_order_id: orderId },
    });
    const attemptNumber = previousAttempts + 1;
    console.log("Event: Calculated attempt number", { orderId, attemptNumber });

    // **Step 3: Store both request and response data in ESign**
    let esignRecord: ESign;
    try {
      console.log("Event: Storing e-KYC data in ESign", { orderId });
      esignRecord = await ESign.create({
        // partner_order_id: orderId,
        order_id: orderDetails.dataValues.id, // Use Order table's primary key (UUID)
        partner_order_id: orderId, // This is BMFORDERID001
        attempt_number: attemptNumber,
        task_id: requestData.task_id,
        group_id: requestData.group_id,
        // esign_file_details: requestData.data.esign_file_details,
        esign_file_details: {
          ...requestData.data.esign_file_details,
          esign_file: signedUrl,
        },
        esign_stamp_details: requestData.data.esign_stamp_details,
        esign_invitees: requestData.data.esign_invitees,
        status:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success"
            ? "completed"
            : "failed",
        esign_details: responseData.result?.source_output || responseData,
        esign_doc_id: responseData.result?.source_output?.document_id || null,
        request_id: responseData.request_id || null,
        completed_at: responseData.status === "completed" ? new Date() : null,
        esign_expiry: responseData.result?.source_output?.expiry || null,
        active:
          responseData.status === "completed" &&
          responseData.result?.source_output?.status === "Success",
        expired: false,
        rejected: false,
      });

      this.logger.log(
        `Saved e-KYC request and response data to ESign model for order: ${orderId}`
      );
      console.log("Event: ESign record saved", {
        orderId,
        esignRecord: esignRecord.toJSON(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to save e-KYC request and response data: ${error.message}`,
        error.stack
      );
      console.log("Event: Failed to save ESign record", {
        orderId,
        error: error.message,
      });
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: "Failed to save e-KYC request and response data",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // **Step 4: Extract and update e-sign details in order**
    const esignDetails =
      responseData.result?.source_output?.esign_details || [];
    const validEsign = esignDetails.find((esign) => esign.url_status === true);
    console.log("Event: Extracted e-sign details", { orderId, validEsign });

    if (validEsign) {
      const span = opentracing
        .globalTracer()
        .startSpan("update-order-controller");
      const childSpan = span
        .tracer()
        .startSpan("update-e-sign", { childOf: span });

      try {
        console.log("Event: Updating order with e-sign details", { orderId });
        // Dynamic status based on signing state
        const requestDetail = {
          is_active: validEsign.url_status, // true
          is_signed: false, // No signing confirmation yet
          is_expired: validEsign.esign_expiry
            ? new Date(validEsign.esign_expiry) < new Date()
            : false, // false
          is_rejected: false, // No rejection
        };

        let eSignStatus: string;
        const { is_active, is_signed, is_expired, is_rejected } = requestDetail;

        if (is_active && is_signed) {
          eSignStatus = "completed";
        } else if (is_active && !is_expired && !is_rejected && !is_signed) {
          eSignStatus = "pending"; // This applies here
        } else if (is_expired && !is_rejected) {
          eSignStatus = "expired";
        } else if (is_rejected || (is_active && is_expired)) {
          eSignStatus = "rejected";
        } else {
          eSignStatus = "pending";
        }
        await this.orderService.updateOrder(childSpan, orderId, {
          e_sign_status: eSignStatus,
          e_sign_link: validEsign.esign_url,
          e_sign_link_status: "active",
          e_sign_link_expires: validEsign.esign_expiry
            ? new Date(validEsign.esign_expiry).toISOString() // Use actual expiry
            : null,
          e_sign_link_doc_id: responseData.result?.source_output?.esign_doc_id,
          e_sign_link_request_id: responseData?.request_id,
        });

        this.logger.log(`updated order ${orderId} with e-sign details`);
        console.log("Event: Order updated with e-sign details", { orderId });
      } catch (error) {
        childSpan.log({ event: "error", message: error.message });
        this.logger.error(
          `Failed to update order ${orderId} with e-sign details: ${error.message}`,
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
            details: "Failed to update order with e-sign details",
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } finally {
        childSpan.finish();
      }
    }

    // **Step 5: Return response based on API result**
    if (
      responseData.status === "completed" &&
      responseData.result?.source_output?.status === "Success"
    ) {
      this.logger.log(
        `e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`
      );
      console.log("Event: e-KYC request succeeded", {
        orderId,
        requestId: responseData.request_id,
      });
      return {
        success: true,
        data: responseData,
        message: "e-KYC document generation completed successfully",
      };
    } else {
      this.logger.warn(
        `e-KYC request completed with unexpected status for order: ${orderId}`,
        responseData
      );
      console.log("Event: Unexpected e-KYC response", {
        orderId,
        responseData,
      });
      throw new HttpException(
        {
          success: false,
          message: responseData,
          details: "Unexpected e-KYC response",
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

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
      throw new HttpException(
        error.response?.data || "Failed to retrieve task details",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleEkycRetrieveWebhook(partner_order_id: string): Promise<any> {
    const token = process.env.API_KEY; // Fetch from .env
    if (!token || typeof token !== "string") {
      throw new HttpException(
        "Invalid or missing API key in configuration",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!partner_order_id) {
      throw new HttpException(
        "Missing required field: partner_order_id",
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.log(
      `Processing e-KYC retrieve webhook for partner_order_id: ${partner_order_id}`
    );

    // Check for existing order with the same partner_order_id
    const orderData = await this.orderRepository.findOne({
      where: { partner_order_id: partner_order_id },
      include: [{ model: ESign, as: "esigns" }],
    });
    if (!orderData) {
      this.logger.warn(
        `No order found for partner_order_id: ${partner_order_id}`
      );
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }
    const task_id = partner_order_id; // task_id is same as partner_order_id
    const group_id = orderData?.dataValues?.partner_id; // Fetch group_id from order as partner_id

    if (!group_id) {
      this.logger.warn(
        `No partner_id (group_id) found for partner_order_id: ${partner_order_id}`
      );
      throw new HttpException(
        "group_id not available in order",
        HttpStatus.BAD_REQUEST
      );
    }
    console.log(orderData?.dataValues);
    const esignRecords = orderData?.dataValues?.esigns || [];
    if (!esignRecords.length) {
      this.logger.warn(
        `No ESign records found for partner_order_id: ${partner_order_id}`
      );
      throw new HttpException("No ESign records found", HttpStatus.NOT_FOUND);
    }
    // Get esign_doc_id from Order table (assuming it's a field like e_sign_link_doc_id)
    const esign_doc_id = orderData?.dataValues?.e_sign_link_doc_id; // Adjust field name if different

    if (!esign_doc_id) {
      this.logger.warn(
        `No esign_doc_id found in order for partner_order_id: ${partner_order_id}`
      );
      throw new HttpException(
        "esign_doc_id not available",
        HttpStatus.BAD_REQUEST
      );
    }
    console.log(esign_doc_id);
    // Prepare request payload
    const requestData = {
      task_id,
      group_id,
      data: {
        user_key: "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv", // Fetch from .env
        esign_doc_id,
      },
    };

    const responseData = await this.retrieveEkycData(requestData);
    console.log(responseData);
    // Find matching ESign record
    const esignRecord = await this.esignRepository.findOne({
      where: {
        partner_order_id,
        [Op.or]: [
          { esign_doc_id },
          Sequelize.where(
            Sequelize.literal("esign_details->>'esign_doc_id'"),
            Op.eq,
            esign_doc_id
          ),
        ],
      },
      logging: console.log, // Debugging
    });

    if (!esignRecord) {
      this.logger.warn(
        `No ESign record found for task_id: ${task_id} and esign_doc_id: ${esign_doc_id}`
      );
      throw new HttpException("ESign record not found", HttpStatus.NOT_FOUND);
    }

    const { source_output } = responseData.result;
    const requestDetail = source_output.request_details[0];

    const ESigncompletedAt = responseData?.completed_at
      ? responseData?.completed_at
      : null;

    // Manually parse `esign_expiry` if it exists
    let esignExpiry = esignRecord.esign_expiry; // Default to existing expiry

    if (requestDetail.expiry_date) {
      const rawExpiry = requestDetail.expiry_date; // Example: "24-03-2025 23:59:59"
      const [day, month, year, hours, minutes, seconds] =
        rawExpiry.split(/[-\s:]/);
      const formattedExpiry = `${year}-${month}-${day}T${hours || "00"}:${
        minutes || "00"
      }:${seconds || "00"}Z`;
      esignExpiry = new Date(formattedExpiry);
    }

    // Validate `completedAt`
    if (ESigncompletedAt ) {
      this.logger.error(
        `Invalid completed_at value: ${responseData.completed_at}`
      );
      throw new HttpException(
        "Invalid completed_at timestamp",
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate `esignExpiry`
    if (esignExpiry && isNaN(esignExpiry.getTime())) {
      this.logger.error(
        `Invalid esign_expiry value: ${requestDetail.expiry_date}`
      );
      throw new HttpException(
        "Invalid esign_expiry timestamp",
        HttpStatus.BAD_REQUEST
      );
    }

    // Determine e_sign_status
    let eSignStatus: string;
    const { is_active, is_signed, is_expired, is_rejected } = requestDetail;

    if (is_active && is_signed) {
      eSignStatus = "completed";
    } else if (is_active && !is_expired && !is_rejected && !is_signed) {
      eSignStatus = "pending";
    } else if (is_expired && !is_rejected) {
      eSignStatus = "expired";
    } else if (is_rejected || (is_active && is_expired)) {
      eSignStatus = "rejected";
    } else {
      eSignStatus = "pending"; // Default case
    }

    await esignRecord.update({
      status: responseData.status,
      request_id: responseData.request_id,
      active: is_active,
      expired: is_expired,
      rejected: is_rejected,
      is_signed: is_signed,
      esign_url: requestDetail.esign_url,
      esigner_email: requestDetail.esigner_email,
      esigner_phone: requestDetail.esigner_phone,
      esign_type: requestDetail.esign_type,
      esign_folder: source_output.esign_folder,
      esign_irn: source_output.esign_irn,
      esigners: source_output.esigners,
      file_details: source_output.file_details,
      request_details: source_output.request_details,
      esign_details: {
        ...esignRecord.esign_details,
        status: source_output.status,
      },
    });

    console.log('updating order',{
      e_sign_status: eSignStatus,
      e_sign_customer_completion_date:ESigncompletedAt
    })

    await orderData.update({
      e_sign_status: eSignStatus,
      e_sign_customer_completion_date:ESigncompletedAt
    });

    this.logger.log(
      `Updated Order record for task_id: ${task_id}, e_sign_status: ${eSignStatus}`
    );
    this.logger.log(
      `Updated ESign record for task_id: ${task_id}, esign_doc_id: ${esign_doc_id}`
    );

    return {
      success: true,
      message: "Webhook processed successfully",
      data: responseData,
    };
  }

  async retrieveEkycData(requestData: any) {
    try {
      const response = await axios.post(this.RETRIEVE_API_URL, requestData, {
        headers: {
          "api-key": this.API_KEY,
          "account-id": this.ACCOUNT_ID,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve e-KYC data: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        error.response?.data || "Failed to retrieve e-KYC data",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async convertUrlsToBase64(urls: string[]): Promise<any> {
    const results = [];
    const errors = [];

    await Promise.all(
      urls.map(async (url, index) => {
        try {
          const response = await axios.get(url, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(response.data);
          const base64 = buffer.toString("base64");

          results.push({
            url,
            base64,
            mimeType:
              response.headers["content-type"] || "application/octet-stream",
          });
          this.logger.log(`Converted ${url} to Base64 successfully`);
        } catch (error) {
          const errorMessage = error.message || "Unknown error";
          errors.push({ url, error: `Failed to process URL: ${errorMessage}` });
          this.logger.error(
            `Error converting ${url}: ${errorMessage}`,
            error.stack
          );
        }
      })
    );

    if (errors.length === urls.length) {
      throw new HttpException(
        {
          success: false,
          message: errors,
          details: "All URL conversions failed",
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      success: true,
      message: "URLs processed successfully",
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async sendEkycRequestBase64(token: string, requestData: any): Promise<any> {
    if (!token || typeof token !== "string") {
      throw new HttpException(
        "Invalid or missing X-API-Key token",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!requestData || typeof requestData !== "object") {
      throw new HttpException(
        "Request data must be a valid JSON object",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!requestData.data?.esign_file_details?.esign_file) {
      throw new HttpException(
        "Missing required esign_file in request data",
        HttpStatus.BAD_REQUEST
      );
    }

    let esignFile = requestData.data.esign_file_details.esign_file;

    // Handle esign_file based on its type
    if (typeof esignFile === "string") {
      if (esignFile.startsWith("http")) {
        // Case 1: URL - Convert to Base64
        this.logger.log(
          `Detected URL in esign_file: ${esignFile}. Converting to Base64...`
        );
        console.log(
          `Detected URL in esign_file: ${esignFile}. Converting to Base64...`
        );
        const conversionResult = await this.convertUrlsToBase64([esignFile]);

        if (!conversionResult.success || conversionResult.data.length === 0) {
          throw new HttpException(
            {
              success: false,
              message: conversionResult.errors,
              details: "Failed to convert URL to Base64",
            },
            HttpStatus.BAD_REQUEST
          );
        }

        esignFile = conversionResult.data[0].base64;
        this.logger.log("URL converted to Base64 successfully");
      } else {
        // Case 2: Assume Base64 - Validate it
        this.logger.log(
          "Detected potential Base64 string in esign_file. Validating..."
        );
        const trimmedEsignFile = esignFile.trim();

        // Check if it looks like a valid Base64-encoded PDF (starts with PDF magic number "JVBERi0x")
        if (!trimmedEsignFile.startsWith("JVBERi0x")) {
          try {
            // Attempt to decode and re-encode to verify Base64 validity
            const decoded = Buffer.from(trimmedEsignFile, "base64");
            const reEncoded = decoded.toString("base64");
            if (reEncoded !== trimmedEsignFile) {
              throw new Error("Invalid Base64 format");
            }
          } catch (error) {
            throw new HttpException(
              {
                success: false,
                message: error.message,
                details: "Invalid Base64 string provided for esign_file",
              },
              HttpStatus.BAD_REQUEST
            );
          }
        }
        esignFile = trimmedEsignFile; // Use as-is if valid
        this.logger.log("Base64 string validated successfully");
      }
    } else {
      throw new HttpException(
        "esign_file must be a string (URL or Base64)",
        HttpStatus.BAD_REQUEST
      );
    }

    // Update requestData with the processed esignFile
    requestData.data.esign_file_details.esign_file = esignFile;

    try {
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
        headers: {
          "api-key": this.API_KEY,
          "account-id": this.ACCOUNT_ID,
          "Content-Type": "application/json",
          "X-API-Key": token,
        },
      });

      const responseData = response.data as EkycApiResponse;
      if (
        responseData.status === "completed" &&
        responseData.result?.source_output?.status === "Success"
      ) {
        this.logger.log(`e-KYC request succeeded: ${responseData.request_id}`);
        return {
          success: true,
          data: responseData,
          message: "e-KYC document generation completed successfully",
        };
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Error in sendEkycRequest: ${axiosError.message}`,
        axiosError.stack
      );

      if (axiosError.response) {
        const { status, data } = axiosError.response;
        const apiResponse = data as EkycApiResponse;
        const apiMessage = apiResponse.message || "Unknown error";
        let errorMessage = "Failed to generate e-KYC document";

        if (status === HttpStatus.BAD_REQUEST) {
          if (apiMessage.includes("Base64")) {
            errorMessage = "Invalid Base64 PDF data provided";
          } else if (apiMessage.includes("Malformed Request")) {
            errorMessage =
              "Malformed request: Check JSON structure or required fields";
          } else {
            errorMessage = apiMessage;
          }
        } else if (status === HttpStatus.UNAUTHORIZED) {
          errorMessage = "Invalid or expired X-API-Key token";
        } else if (status === HttpStatus.FORBIDDEN) {
          errorMessage = "Access denied: Check API key or account permissions";
        } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
          errorMessage = "e-KYC service encountered an internal error";
        }

        throw new HttpException(
          {
            success: false,
            message: apiResponse,
            details: errorMessage,
            request_id: apiResponse.request_id,
          },
          status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      throw new HttpException(
        {
          success: false,
          message: axiosError.message,
          details: axiosError.request
            ? "Network error: Unable to reach e-KYC service"
            : "An unexpected error occurred",
        },
        axiosError.request
          ? HttpStatus.SERVICE_UNAVAILABLE
          : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
