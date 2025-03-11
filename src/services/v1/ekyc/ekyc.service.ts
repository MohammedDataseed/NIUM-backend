  import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
  import * as opentracing from 'opentracing';
  import axios, { AxiosError } from "axios";
  import { GetObjectCommand } from "@aws-sdk/client-s3"; // Add this import
  import { PdfService } from "../document-consolidate/document-consolidate.service";
  import { OrdersService } from "../order/order.service";
  import { PDFDocument } from "pdf-lib";
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
      private readonly pdfService: PdfService,
      private readonly orderService: OrdersService,
    ) {} // Inject PdfService

    // Existing convertUrlsToBase64 method (unchanged)
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

    async sendEkycRequestOld(token: string, requestData: any): Promise<any> {
      if (!token || typeof token !== "string") {
        throw new HttpException("Invalid or missing X-API-Key token", HttpStatus.BAD_REQUEST);
      }
    
      if (!requestData || typeof requestData !== "object") {
        throw new HttpException("Request data must be a valid JSON object", HttpStatus.BAD_REQUEST);
      }
    
      if (!requestData.order_id) {
        throw new HttpException("Missing required order_id in request data", HttpStatus.BAD_REQUEST);
      }
    
      const orderId = requestData.order_id;
      this.logger.log(`Processing e-KYC request for order: ${orderId}`);
    
      let esignFile;
      let orderDetails;
    
      try {
        // Fetch order details
        // orderDetails = await this.orderService.findOne(orderId);
        const span = opentracing.globalTracer().startSpan("fetch-order-details"); // Start a new span
orderDetails = await this.orderService.findOne(span, orderId);
span.finish(); // Ensure span is properly finished after use
        if (!orderDetails) {
          throw new HttpException(`Order not found: ${orderId}`, HttpStatus.NOT_FOUND);
        }
        this.logger.log(`Fetched order details successfully for ${orderId}`);
      } catch (error) {
        this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
        throw new HttpException(
          { success: false, message: "Failed to fetch order details", details: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    
      // Merge PDFs
      try {
        const fileList = await this.pdfService.listFilesByFolder(orderId);
        const files = fileList.files?.filter(file => file.name.endsWith(".pdf") && !file.name.includes("merged_")) || [];
    
        if (files.length === 0) {
          throw new HttpException(`No valid PDFs found in folder: ${orderId}`, HttpStatus.BAD_REQUEST);
        }
    
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          try {
            const response = await axios.get(file.signed_url, { responseType: "arraybuffer" });
            const subPdf = await PDFDocument.load(response.data);
            const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
            this.logger.log(`Merged ${file.name} into the final PDF`);
          } catch (err) {
            this.logger.error(`Skipping ${file.name} due to error: ${err.message}`, err.stack);
          }
        }
    
        if (mergedPdf.getPageCount() === 0) {
          throw new HttpException(`No valid pages found for merging PDFs in folder: ${orderId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        esignFile = Buffer.from(await mergedPdf.save()).toString("base64");
        this.logger.log(`Merged PDFs successfully for order: ${orderId}`);
      } catch (error) {
        this.logger.error(`Failed to merge PDFs: ${error.message}`, error.stack);
        throw new HttpException(
          { success: false, message: `Failed to merge PDFs for order: ${orderId}`, details: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    
      // Prepare request payload
      const finalRequestData = {
        ...requestData,
        ...orderDetails,
        // data: {
        //   ...(requestData.data || {}),
        //   esign_file_details: { esign_file },
        // },
      };

      console.log(finalRequestData)
    
      // Make e-KYC request
      try {
        const response = await axios.post(this.REQUEST_API_URL, finalRequestData, {
          headers: {
            "api-key": this.API_KEY,
            "account-id": this.ACCOUNT_ID,
            "Content-Type": "application/json",
            "X-API-Key": token,
          },
        });
    
        const responseData = response.data;
        if (responseData.status === "completed" && responseData.result?.source_output?.status === "Success") {
          this.logger.log(`e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`);
          return { success: true, data: responseData, message: "e-KYC document generation completed successfully" };
        } else {
          this.logger.warn(`e-KYC request completed with unexpected status for order: ${orderId}`, responseData);
          throw new HttpException({ success: false, message: "Unexpected e-KYC response", details: responseData }, HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        this.logger.error(`Error in sendEkycRequest: ${error.message}`, error.stack);
    
        if (error.response) {
          const { status, data } = error.response;
          throw new HttpException(
            { success: false, message: data.message || "e-KYC request failed", details: data },
            status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    
        throw new HttpException(
          { success: false, message: "Network error: Unable to reach e-KYC service", details: error.message },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
    }
    
    async getMergedPdfBase64(orderId: string): Promise<string> {
      this.logger.log(`Processing e-KYC request for order: ${orderId}`);
    
      let esignFile: string;
    
      try {
        // Fetch list of PDF files from storage
        const fileList = await this.pdfService.listFilesByFolder(orderId);
        const files = fileList.files?.filter(file => file.name.endsWith(".pdf") && !file.name.includes("merged_")) || [];
    
        if (files.length === 0) {
          throw new HttpException(`No valid PDFs found in folder: ${orderId}`, HttpStatus.BAD_REQUEST);
        }
    
        // Merge PDFs
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          try {
            const response = await axios.get(file.signed_url, { responseType: "arraybuffer" });
            const subPdf = await PDFDocument.load(response.data);
            const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
            this.logger.log(`Merged ${file.name} into the final PDF`);
          } catch (err) {
            this.logger.error(`Skipping ${file.name} due to error: ${err.message}`, err.stack);
          }
        }
    
        if (mergedPdf.getPageCount() === 0) {
          throw new HttpException(`No valid pages found for merging PDFs in folder: ${orderId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        // Convert merged PDF to Base64
        esignFile = Buffer.from(await mergedPdf.save()).toString("base64");
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
        throw new HttpException("Invalid or missing X-API-Key token", HttpStatus.BAD_REQUEST);
      }
    
      this.logger.log(`Processing e-KYC request for order: ${orderId}`);
    
      let esignFile: string;
      let orderDetails: any;
    
      try {
        // Fetch order details
        const span = opentracing.globalTracer().startSpan("fetch-order-details");
        orderDetails = await this.orderService.findOne(span, orderId);
        span.finish();
    
        if (!orderDetails) {
          throw new HttpException(`Order not found: ${orderId}`, HttpStatus.NOT_FOUND);
        }
    
        this.logger.log(`Fetched order details successfully for ${orderId}`);
      } catch (error) {
        this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
        throw new HttpException(
          { success: false, message: "Failed to fetch order details", details: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    
      // // Merge PDFs if available
      // try {
      //   const fileList = await this.pdfService.listFilesByFolder(orderId);
      //   const files = fileList.files?.filter(file => file.name.endsWith(".pdf") && !file.name.includes("merged_")) || [];
    
      //   if (files.length === 0) {
      //     throw new HttpException(`No valid PDFs found in folder: ${orderId}`, HttpStatus.BAD_REQUEST);
      //   }
    
      //   const mergedPdf = await PDFDocument.create();
      //   for (const file of files) {
      //     try {
      //       const response = await axios.get(file.signed_url, { responseType: "arraybuffer" });
      //       const subPdf = await PDFDocument.load(response.data);
      //       const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
      //       copiedPages.forEach(page => mergedPdf.addPage(page));
      //       this.logger.log(`Merged ${file.name} into the final PDF`);
      //     } catch (err) {
      //       this.logger.error(`Skipping ${file.name} due to error: ${err.message}`, err.stack);
      //     }
      //   }
    
      //   if (mergedPdf.getPageCount() === 0) {
      //     throw new HttpException(`No valid pages found for merging PDFs in folder: ${orderId}`, HttpStatus.INTERNAL_SERVER_ERROR);
      //   }
    
      //   esignFile = Buffer.from(await mergedPdf.save()).toString("base64");
      //   this.logger.log(`Merged PDFs successfully for order: ${orderId}`);
      //   const data={
      //     'esignFile':esignFile,
      //   }
      //   console.log(data);
      // } catch (error) {
      //   this.logger.error(`Failed to merge PDFs: ${error.message}`, error.stack);
      //   throw new HttpException(
      //     { success: false, message: `Failed to merge PDFs for order: ${orderId}`, details: error.message },
      //     HttpStatus.INTERNAL_SERVER_ERROR
      //   );
      // }
    
      const mergedPdfBase64 = await this.getMergedPdfBase64(orderId);

      // **Prepare Request Payload**
      const requestData={
        task_id: orderDetails.order_id || "default_task",
        group_id: "44",
        order_id: orderId,
        data: {
          flow_type: "PDF",
          user_key: "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv",
          verify_aadhaar_details: false,
          esign_file_details: {
            esign_profile_id: "SWRN1iH",
            file_name: `${orderDetails.order_id}-file`,
            esign_file:mergedPdfBase64, // Attach the merged PDF as base64
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
    
      this.logger.log("Final Request Payload:");
      console.log(requestData);

        // Make e-KYC request
      try {
        // return requestData
        const response = await axios.post(this.REQUEST_API_URL, requestData, {
          headers: {
            "api-key": this.API_KEY,
            "account-id": this.ACCOUNT_ID,
            "Content-Type": "application/json",
            "X-API-Key": token,
          },
        });
    
        const responseData = response.data;
        if (responseData.status === "completed" && responseData.result?.source_output?.status === "Success") {
          this.logger.log(`e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`);
          return { success: true, data: responseData, message: "e-KYC document generation completed successfully" };
        } else {
          this.logger.warn(`e-KYC request completed with unexpected status for order: ${orderId}`, responseData);
          throw new HttpException({ success: false, message: "Unexpected e-KYC response", details: responseData }, HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        this.logger.error(`Error in sendEkycRequest: ${error.message}`, error.stack);
    
        if (error.response) {
          const { status, data } = error.response;
          throw new HttpException(
            { success: false, message: data.message || "e-KYC request failed", details: data },
            status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    
        throw new HttpException(
          { success: false, message: "Network error: Unable to reach e-KYC service", details: error.message },
          HttpStatus.SERVICE_UNAVAILABLE
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
      throw new HttpException(
        error.response?.data || "Failed to retrieve e-KYC data",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
