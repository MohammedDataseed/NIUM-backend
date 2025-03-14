  import { Inject,Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
  import * as opentracing from 'opentracing';
  import axios, { AxiosError } from "axios";
  import { GetObjectCommand } from "@aws-sdk/client-s3"; // Add this import
  import { PdfService } from "../document-consolidate/document-consolidate.service";
  import { OrdersService } from "../order/order.service";
  import { PDFDocument } from "pdf-lib";
  import { Order } from "src/database/models/order.model";
  import { ESign } from "src/database/models/esign.model";
  import {EkycRetrieveRequestDto} from "src/dto/ekyc-request.dto"
  // Define interfaces for the API response structure
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
    // private readonly REQUEST_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_document';
    // private readonly REQUEST_TASK_API_URL = 'https://eve.idfy.com/v3/tasks';
    // private readonly RETRIEVE_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve';
    // private readonly API_KEY = '67163d36-d269-11ef-b1ca-feecce57f827';
    // private readonly ACCOUNT_ID = '9d956848da98/b5d7ded1-218b-4c63-97ea-71ba70f038d3';
    private readonly REQUEST_API_URL = process.env.REQUEST_API_URL;
    private readonly REQUEST_TASK_API_URL = process.env.REQUEST_TASK_API_URL;
    private readonly RETRIEVE_API_URL = process.env.RETRIEVE_API_URL;
    private readonly API_KEY = process.env.API_KEY;
    private readonly ACCOUNT_ID = process.env.ACCOUNT_ID;
    private readonly logger = new Logger(EkycService.name);

    constructor(
      @Inject('ORDER_REPOSITORY')
      private readonly orderRepository: typeof Order,
      @Inject('E_SIGN_REPOSITORY')
      private readonly esignRepository: typeof ESign,
      private readonly pdfService: PdfService,
      private readonly orderService: OrdersService,
    ) {} 

    // Existing convertUrlsToBase64 method 
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
            message: "All URL conversions failed",
            details: errors,
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

    
    async getMergedPdfBase64(orderId: string): Promise<string> {
      this.logger.log(`Processing e-KYC request for order: ${orderId}`);
    
      try {
        // Fetch list of PDF files from storage
        const fileList = await this.pdfService.listFilesByFolder(orderId);
        const files = fileList.files?.filter(file => file.name.endsWith(".pdf") && !file.name.includes("merged")) || [];
    
        if (files.length === 0) {
          throw new HttpException(`No valid PDFs found in folder: ${orderId}`, HttpStatus.BAD_REQUEST);
        }
    
        // Merge PDFs
        const mergedPdf = await PDFDocument.create();
        let successfulMerges = 0;
    
        for (const file of files) {
          try {
            this.logger.log(`Fetching: ${file.signed_url}`);
            const response = await axios.get(file.signed_url, { responseType: "arraybuffer" });
    
            const subPdf = await PDFDocument.load(response.data);
            const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
    
            this.logger.log(`Merged: ${file.name}`);
            successfulMerges++;
          } catch (err) {
            this.logger.error(`Skipping ${file.name} due to error: ${err.message}`, err.stack);
          }
        }
    
        if (successfulMerges === 0) {
          throw new HttpException(`Failed to merge any PDFs for order: ${orderId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        // Convert merged PDF to Base64
        const esignFile = Buffer.from(await mergedPdf.save()).toString("base64");
        this.logger.log(`Merged PDFs successfully for order: ${orderId}`);
    
        return esignFile;
      } catch (error) {
        this.logger.error(`Failed to merge PDFs: ${error.message}`, error.stack);
        throw new HttpException(
          { success: false, message: `Failed to merge PDFs for order: ${orderId}`, details: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    async sendEkycRequest(token: string, orderId: string): Promise<any> {
      if (!token || typeof token !== "string") {
        console.log("Token Validation Failed:", { token, message: "Invalid or missing X-API-Key token" });
        throw new HttpException("Invalid or missing X-API-Key token", HttpStatus.BAD_REQUEST);
      }
    
      this.logger.log(`Processing e-KYC request for order: ${orderId}`);
      console.log("Event: Starting e-KYC request processing", { orderId });
    
      let orderDetails: any;
    
      try {
        const span = opentracing.globalTracer().startSpan("fetch-order-details");
        console.log("Event: Fetching order details", { orderId, spanId: span.context().toSpanId() });
        orderDetails = await this.orderService.findOne(span, orderId);
        span.finish();
    
        if (!orderDetails) {
          console.log("Event: Order not found", { orderId });
          throw new HttpException(`Order not found: ${orderId}`, HttpStatus.NOT_FOUND);
        }
    
        this.logger.log(`Fetched order details successfully for ${orderId}`);
        console.log("Event: Order details fetched", { orderId, orderDetails });
      } catch (error) {
        this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
        console.log("Event: Error fetching order details", { orderId, error: error.message });
        throw new HttpException(
          { success: false, message: "Failed to fetch order details", details: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    
      console.log("Event: Generating merged PDF", { orderId });
      const mergedPdfBase64 = await this.getMergedPdfBase64(orderId);
      console.log("Event: Merged PDF generated", { orderId, mergedPdfLength: mergedPdfBase64.length });
    
      // **Prepare Request Payload**
      const requestData = {
        task_id: orderDetails.partner_order_id,
        group_id: orderDetails.partner_id,
        order_id: orderId,
        data: {
          flow_type: "PDF",
          user_key: "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv",
          verify_aadhaar_details: false,
          esign_file_details: {
            esign_profile_id: "SWRN1iH",
            file_name: `${orderDetails.partner_order_id}-file`,
            esign_file: mergedPdfBase64,
            esign_fields: { esign_fields: orderDetails.esign_fields || {} },
            esign_additional_files: orderDetails.esign_additional_files || [],
            esign_allow_fill: orderDetails.esign_allow_fill || false,
          },
          esign_stamp_details: {
            esign_stamp_series: "",
            esign_series_group: "",
            esign_stamp_value: "",
          },
          esign_invitees: [
            {
              esigner_name: orderDetails.customer_name,
              esigner_email: orderDetails.customer_email,
              esigner_phone: orderDetails.customer_phone,
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
        data: {
          ...requestData.data,
          esign_file_details: {
            ...requestData.data.esign_file_details,
            esign_file: mergedPdfBase64.substring(0, 20) + '...',
          },
        },
      };
      this.logger.log("Final Request Payload:");
      console.log("Request Data:", JSON.stringify(logData, null, 2));
    
      // **Step 1: Make e-KYC request first**
      let responseData: any;
      try {
        console.log("Event: Sending e-KYC request", { orderId, url: this.REQUEST_API_URL });
        const response = await axios.post(this.REQUEST_API_URL, requestData, {
          headers: {
            "api-key": this.API_KEY,
            "account-id": this.ACCOUNT_ID,
            "Content-Type": "application/json",
            "X-API-Key": token,
          },
        });
        responseData = response.data;
        this.logger.log(`e-KYC API request completed for order: ${orderId}`);
        console.log("Success Response:", JSON.stringify(responseData, null, 2));
      } catch (error) {
        this.logger.error(`Error in e-KYC API request: ${error.message}`, error.stack);
    
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
    
        console.log("Failure Response:", { errorMessage, errorDetails: errorDetails || { error: errorMessage }, httpStatus });
    
        const previousAttempts = await ESign.count({ where: { partner_order_id: orderId } });
        const attemptNumber = previousAttempts + 1;
        console.log("Event: Storing failed e-KYC attempt", { orderId, attemptNumber });
    
        // await ESign.create({
        //   partner_order_id: orderId,
        //   attempt_number: attemptNumber,
        //   task_id: requestData.task_id,
        //   group_id: requestData.group_id,
        //   // esign_file_details: requestData.data.esign_file_details,
        //   esign_file_details: {
        //     ...requestData.data.esign_file_details,
        //     esign_file: "https://fibregridstorage.blr1.digitaloceanspaces.com/Fibregrid_projects/FY_25-26/NIUM/NIUM-NODE_NIU_25-26_01_[Ekfrazo]/stage 4/PDF Files/merged_1741857821406_part1.pdf", // Store S3 URL instead of Base64
        //   },
        //   esign_stamp_details: requestData.data.esign_stamp_details,
        //   esign_invitees: requestData.data.esign_invitees,
        //   status: "failed",
        //   esign_details: errorDetails || { error: errorMessage },
        //   active: false,
        //   expired: false,
        //   rejected: false,
        // });
        
        
        // In sendEkycRequest method, inside the ESign.create call
await ESign.create({
  partner_order_id: orderId,
          attempt_number: attemptNumber,
          task_id: requestData.task_id,
          group_id: requestData.group_id,
          esign_file_details: {
                ...requestData.data.esign_file_details,
                esign_file: "https://fibregridstorage.blr1.digitaloceanspaces.com/Fibregrid_projects/FY_25-26/NIUM/NIUM-NODE_NIU_25-26_01_[Ekfrazo]/stage 4/PDF Files/merged_1741857821406_part1.pdf", // Store S3 URL instead of Base64
              },
  esign_stamp_details: requestData.data.esign_stamp_details,
  esign_invitees: requestData.data.esign_invitees,
  status: responseData.status === "completed" && responseData.result?.source_output?.status === "Success" ? "completed" : "failed",
  esign_details: responseData.result?.source_output || responseData,
  esign_doc_id: responseData.result?.source_output?.esign_doc_id || null, // Fix: Set this correctly
  request_id: responseData.request_id || null,
  completed_at: responseData.status === "completed" ? new Date() : null,
  esign_expiry: responseData.result?.source_output?.expiry || null,
  active: responseData.status === "completed" && responseData.result?.source_output?.status === "Success",
  expired: false,
  rejected: false,
});
    
        throw new HttpException(
          { success: false, message: errorMessage, details: errorDetails },
          httpStatus
        );
      }
    
      // **Step 2: Calculate the attempt number**
      const previousAttempts = await ESign.count({ where: { partner_order_id: orderId } });
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
            esign_file:"https://fibregridstorage.blr1.digitaloceanspaces.com/Fibregrid_projects/FY_25-26/NIUM/NIUM-NODE_NIU_25-26_01_[Ekfrazo]/stage 4/PDF Files/merged_1741857821406_part1.pdf", // Use S3 URL instead of Base64
          },
          esign_stamp_details: requestData.data.esign_stamp_details,
          esign_invitees: requestData.data.esign_invitees,
          status: responseData.status === "completed" && responseData.result?.source_output?.status === "Success" ? "completed" : "failed",
          esign_details: responseData.result?.source_output || responseData,
          esign_doc_id: responseData.result?.source_output?.document_id || null,
          request_id: responseData.request_id || null,
          completed_at: responseData.status === "completed" ? new Date() : null,
          esign_expiry: responseData.result?.source_output?.expiry || null,
          active: responseData.status === "completed" && responseData.result?.source_output?.status === "Success",
          expired: false,
          rejected: false,
        });
    
        this.logger.log(`Saved e-KYC request and response data to ESign model for order: ${orderId}`);
        console.log("Event: ESign record saved", { orderId, esignRecord: esignRecord.toJSON() });
      } catch (error) {
        this.logger.error(`Failed to save e-KYC request and response data: ${error.message}`, error.stack);
        console.log("Event: Failed to save ESign record", { orderId, error: error.message });
        throw new HttpException(
          { success: false, message: "Failed to save e-KYC request and response data", details: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    
      // **Step 4: Extract and update e-sign details in order**
      const esignDetails = responseData.result?.source_output?.esign_details || [];
      const validEsign = esignDetails.find((esign) => esign.url_status === true);
      console.log("Event: Extracted e-sign details", { orderId, validEsign });
    
      if (validEsign) {
        const span = opentracing.globalTracer().startSpan('update-order-controller');
        const childSpan = span.tracer().startSpan('update-e-sign', { childOf: span });
    
        try {
          console.log("Event: Updating order with e-sign details", { orderId });
          await this.orderService.updateOrder(childSpan, orderId, {
            e_sign_status: "Completed",
            e_sign_link: validEsign.esign_url,
            e_sign_link_status: "Active",
            e_sign_link_expires: validEsign.esign_expiry
              ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
              : null,
              e_sign_link_doc_id:responseData.result?.source_output?.esign_doc_id,
              e_sign_link_request_id:responseData?.request_id,
          });
    
          this.logger.log(`Updated order ${orderId} with e-sign details`);
          console.log("Event: Order updated with e-sign details", { orderId });
        } catch (error) {
          childSpan.log({ event: 'error', message: error.message });
          this.logger.error(`Failed to update order ${orderId} with e-sign details: ${error.message}`, error.stack);
          console.log("Event: Failed to update order", { orderId, error: error.message });
          throw new HttpException(
            { success: false, message: "Failed to update order with e-sign details", details: error.message },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        } finally {
          childSpan.finish();
        }
      }
    
      // **Step 5: Return response based on API result**
      if (responseData.status === "completed" && responseData.result?.source_output?.status === "Success") {
        this.logger.log(`e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`);
        console.log("Event: e-KYC request succeeded", { orderId, requestId: responseData.request_id });
        return { success: true, data: responseData, message: "e-KYC document generation completed successfully" };
      } else {
        this.logger.warn(`e-KYC request completed with unexpected status for order: ${orderId}`, responseData);
        console.log("Event: Unexpected e-KYC response", { orderId, responseData });
        throw new HttpException(
          { success: false, message: "Unexpected e-KYC response", details: responseData },
          HttpStatus.BAD_REQUEST
        );
      }
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
              message: "Failed to convert URL to Base64",
              details: conversionResult.errors,
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
                message: "Invalid Base64 string provided for esign_file",
                details: error.message,
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
            message: errorMessage,
            details: apiResponse,
            request_id: apiResponse.request_id,
          },
          status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      throw new HttpException(
        {
          success: false,
          message: axiosError.request
            ? "Network error: Unable to reach e-KYC service"
            : "An unexpected error occurred",
          details: axiosError.message,
        },
        axiosError.request
          ? HttpStatus.SERVICE_UNAVAILABLE
          : HttpStatus.INTERNAL_SERVER_ERROR
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


  // ekyc.service.ts

async handleEkycRetrieveWebhook(token: string, payload: any): Promise<any> {
  if (!token || typeof token !== "string") {
    throw new HttpException("Invalid or missing X-API-Key token", HttpStatus.BAD_REQUEST);
  }

  const { task_id, group_id } = payload;

  if (!task_id || !group_id) {
    throw new HttpException("Missing required fields: task_id or group_id", HttpStatus.BAD_REQUEST);
  }

  this.logger.log(`Processing e-KYC retrieve webhook for task_id: ${task_id}`);

  // Fetch order details to get esign_doc_id
  const order = await this.orderRepository.findOne({
    where: { partner_order_id: task_id },
    include: [{ model: ESign, as: 'esigns' }], // Include related ESign records
  });
  
  if (!order) {
    this.logger.warn(`No order found for partner_order_id: ${task_id}`);
    throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
  }
  
  console.log("Request Data:", JSON.stringify(order, null, 2));


  // Get the latest ESign record's esign_doc_id (assuming latest by createdAt)
  const esignRecords = order.esigns || [];
  if (!esignRecords.length) {
    this.logger.warn(`No ESign records found for partner_order_id: ${task_id}`);
    throw new HttpException("No ESign records found", HttpStatus.NOT_FOUND);
  }

  const latestEsign = esignRecords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const esign_doc_id = latestEsign.esign_doc_id;

  if (!esign_doc_id) {
    this.logger.warn(`No esign_doc_id found for partner_order_id: ${task_id}`);
    throw new HttpException("esign_doc_id not available", HttpStatus.BAD_REQUEST);
  }

  // Prepare request payload for retrieveEkycData
  const requestData = {
    task_id,
    group_id,
    data: {
      user_key: "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv",
      esign_doc_id,
    },
  };

  // Call retrieveEkycData
  const responseData = await this.retrieveEkycData(token, requestData);

  // Find matching ESign record
  const esignRecord = await this.esignRepository.findOne({
    where: {
      partner_order_id: task_id,
      esign_doc_id: esign_doc_id,
    },
  });

  if (!esignRecord) {
    this.logger.warn(`No ESign record found for task_id: ${task_id} and esign_doc_id: ${esign_doc_id}`);
    throw new HttpException("ESign record not found", HttpStatus.NOT_FOUND);
  }

  // Update ESign record with new/changed fields
  const { source_output } = responseData.result;
  const requestDetail = source_output.request_details[0];

  await esignRecord.update({
    status: responseData.status,
    request_id: responseData.request_id,
    completed_at: new Date(responseData.completed_at),
    esign_expiry: requestDetail.expiry_date ? new Date(requestDetail.expiry_date) : esignRecord.esign_expiry,
    active: requestDetail.is_active,
    expired: requestDetail.is_expired,
    rejected: requestDetail.is_rejected,
    is_signed: requestDetail.is_signed,
    esign_url: requestDetail.esign_url,
    esigner_email: requestDetail.esigner_email,
    esigner_phone: requestDetail.esigner_phone,
    esign_type: requestDetail.esign_type,
    // New fields from response
    esign_folder: source_output.esign_folder,
    esign_irn: source_output.esign_irn,
    esigners: source_output.esigners,
    file_details: source_output.file_details,
    request_details: source_output.request_details,
    esign_details: { ...esignRecord.esign_details, status: source_output.status },
  });

  this.logger.log(`Updated ESign record for task_id: ${task_id}, esign_doc_id: ${esign_doc_id}`);

  return {
    success: true,
    message: "Webhook processed successfully",
    data: responseData,
  };
}

async retrieveEkycData(token: string, requestData: any) {
  try {
    const response = await axios.post(this.RETRIEVE_API_URL, requestData, {
      headers: {
        "api-key": this.API_KEY,
        "account-id": this.ACCOUNT_ID,
        "Content-Type": "application/json",
        "X-API-Key": token,
      },
    });

    return response.data;
  } catch (error) {
    this.logger.error(`Failed to retrieve e-KYC data: ${error.message}`, error.stack);
    throw new HttpException(
      error.response?.data || "Failed to retrieve e-KYC data",
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
  // ekyc.service.ts

// async handleEkycRetrieveWebhook(token: string, payload: any): Promise<any> {
//   if (!token || typeof token !== "string") {
//     throw new HttpException("Invalid or missing X-API-Key token", HttpStatus.BAD_REQUEST);
//   }

//   const { task_id, group_id, data } = payload;
//   const { esign_doc_id } = data;

//   if (!task_id || !group_id || !esign_doc_id) {
//     throw new HttpException("Missing required fields: task_id, group_id, or esign_doc_id", HttpStatus.BAD_REQUEST);
//   }

//   this.logger.log(`Processing e-KYC retrieve webhook for task_id: ${task_id}`);

//   // Find matching ESign record
//   const esignRecord = await this.esignRepository.findOne({
//     where: {
//       partner_order_id: task_id,
//       esign_doc_id: esign_doc_id,
//     },
//   });

//   if (!esignRecord) {
//     this.logger.warn(`No ESign record found for task_id: ${task_id} and esign_doc_id: ${esign_doc_id}`);
//     throw new HttpException("ESign record not found", HttpStatus.NOT_FOUND);
//   }

//   // Mock API call to retrieve data (replace with actual axios call if needed)
//   const responseData = {
//     action: "generate",
//     completed_at: "2025-03-13T17:19:23+05:30",
//     created_at: "2025-03-13T17:19:22+05:30",
//     group_id: "00eb04d0-646c-41d5-a69e-197b2b504f01",
//     request_id: "77a48ea1-eb62-440c-9adc-8e2d3d9322fe",
//     result: {
//       source_output: {
//         esign_doc_id: "01JP7MCS88CG1VS26C03ZT9H54",
//         esign_folder: null,
//         esign_irn: null,
//         esigners: [],
//         file_details: {
//           audit_file: "https://storage.idfy.com/77a48ea1-eb62-440c-9adc-8e2d3d9322fe-auditfile.txt?...",
//           esign_file: [
//             "https://storage.idfy.com/77a48ea1-eb62-440c-9adc-8e2d3d9322fe-esign_file0.txt?..."
//           ],
//         },
//         request_details: [
//           {
//             esign_type: null,
//             esign_url: "https://app1.leegality.com/sign/9567b00a-962d-49a2-bc45-f2abcafdf818",
//             esigner_email: "contact2tayib@gmail.com",
//             esigner_name: "Mohammed Tayibulla",
//             esigner_phone: "8550895486",
//             expiry_date: "23-03-2025 23:59:59",
//             is_active: true,
//             is_expired: false,
//             is_rejected: false,
//             is_signed: false,
//           },
//         ],
//         status: "id_found",
//       },
//     },
//     status: "completed",
//     task_id: "NIUMORDERID001",
//     type: "esign_retrieve",
//   };

//   // Update ESign record with new/changed fields
//   const { source_output } = responseData.result;
//   const requestDetail = source_output.request_details[0];

//   await esignRecord.update({
//     status: responseData.status,
//     request_id: responseData.request_id,
//     completed_at: new Date(responseData.completed_at),
//     esign_expiry: requestDetail.expiry_date ? new Date(requestDetail.expiry_date) : esignRecord.esign_expiry,
//     active: requestDetail.is_active,
//     expired: requestDetail.is_expired,
//     rejected: requestDetail.is_rejected,
//     is_signed: requestDetail.is_signed,
//     esign_url: requestDetail.esign_url,
//     esigner_email: requestDetail.esigner_email,
//     esigner_phone: requestDetail.esigner_phone,
//     esign_type: requestDetail.esign_type,
//     // New fields from response
//     esign_folder: source_output.esign_folder,
//     esign_irn: source_output.esign_irn,
//     esigners: source_output.esigners,
//     file_details: source_output.file_details,
//     request_details: source_output.request_details,
//     esign_details: { ...esignRecord.esign_details, status: source_output.status },
//   });

//   this.logger.log(`Updated ESign record for task_id: ${task_id}, esign_doc_id: ${esign_doc_id}`);

//   return {
//     success: true,
//     message: "Webhook processed successfully",
//     data: responseData,
//   };
// }

//   async retrieveEkycData(token: string, requestData: any) {
//     try {
//       const response = await axios.post(this.RETRIEVE_API_URL, requestData, {
//         headers: {
//           "api-key": this.API_KEY,
//           "account-id": this.ACCOUNT_ID,
//           "Content-Type": "application/json",
//           "X-API-Key": token,
//         },
//       });

//       return response.data;
//     } catch (error) {
//       throw new HttpException(
//         error.response?.data || "Failed to retrieve e-KYC data",
//         error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }
}
