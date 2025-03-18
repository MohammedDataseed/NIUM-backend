import {
  HttpException,
  HttpStatus,
  Logger,
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { EkycService } from "../../../../services/v1/ekyc/ekyc.service";
import {
  ApiTags,
  ApiOperation,
  ApiProperty,
  ApiHeader,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import {
  EkycRequestDto,
  EkycRetrieveRequestDto,
} from "src/dto/ekyc-request.dto";
import { Injectable } from "@nestjs/common";
import { OrdersService } from "../../../../services/v1/order/order.service";
import * as opentracing from "opentracing";

// DTO for request body
export class ConvertUrlsToBase64Dto {
  @ApiProperty({
    description: "Array of file URLs to convert to Base64",
    type: [String],
    example: ["https://example.com/file1.pdf", "https://example.com/file2.jpg"],
  })
  urls: string[];
}

@ApiTags("E-KYC")
@Controller("ekyc")
export class EkycController {
  private readonly logger = new Logger(EkycService.name);
  constructor(
    private readonly ekycService: EkycService,
    private readonly ordersService: OrdersService
  ) {}

  @Post("generate-e-sign")
  @ApiOperation({ summary: "Send an e-KYC request to IDfy" })
  @ApiBody({
    schema: {
      properties: {
        partner_order_id: { type: "string", example: "BMFORDERID001" },
      },
    },
  })
  async sendEkycLink(
    @Headers("api_key") apiKey: string,
    @Headers("partner_id") partnerId: string,
    @Body(
      "partner_order_id",
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    )
    partner_order_id: string
  ) {
    if (!partner_order_id) {
      throw new HttpException(
        "Missing required partner_order_id in request data",
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.log(`Processing e-KYC request for order: ${partner_order_id}`);

    const span = opentracing
      .globalTracer()
      .startSpan("find-one-order-controller");
    try {
      // return this.ekycService.sendEkycRequest(partner_order_id);
      await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
      // Call the service method
      const response = await this.ekycService.sendEkycRequest(partner_order_id);

      // If response is successful, transform the output
      if (response.success) {
        return {
          success: true,
          message: "E-sign link generated successfully",
          e_sign_link:
            response.data?.result?.source_output?.esign_details?.find(
              (esign) => esign.url_status === true
            )?.esign_url || null,
          e_sign_link_status:
            response.data?.result?.source_output?.esign_details?.some(
              (esign) => esign.url_status === true
            )
              ? "active"
              : "inactive",
          e_sign_link_expires:
            response.data?.result?.source_output?.esign_details?.find(
              (esign) => esign.url_status === true
            )?.esign_expiry || null,
          e_sign_status: "pending",
        };
      }

      // If response is unsuccessful, return the original response
      return response;
    } catch (error) {
      throw error;
    } finally {
      span.finish();
    }
  }

  // @Post("retrieve-webhook")
  // @ApiOperation({ summary: "Retrieve e-KYC data via webhook" })
  // @ApiResponse({ status: 200, description: "Webhook processed successfully" })
  // @ApiResponse({ status: 400, description: "Invalid request data" })
  // @ApiResponse({ status: 500, description: "Internal server error" })
  // async retrieveEkycWebhook(
  //   @Query("partner_order_id") partner_order_id: string
  // ) {
  //   try {
  //     return await this.ekycService.handleEkycRetrieveWebhook(partner_order_id);
  //   } catch (error) {
  //     throw new HttpException(
  //       { success: false, message: error.message },
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // @Post("retrieve-working-idfy")
  // @ApiOperation({ summary: "Retrieve e-KYC data from IDfy" })
  // @ApiBody({ type: EkycRetrieveRequestDto })
  // async retrieveEkyc(
  //   @Body() requestData: EkycRetrieveRequestDto
  // ) {
  //   return this.ekycService.retrieveEkycData(requestData);
  // }


  @Post("retrieve-webhook")
  @ApiOperation({ summary: "Retrieve e-KYC data via webhook" })
  @ApiResponse({ status: 200, description: "Webhook processed successfully" })
  @ApiResponse({ status: 400, description: "Invalid request data" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async retrieveEkycWebhook(
    @Query("partner_order_id") partner_order_id: string
  ) {
    try {
      return await this.ekycService.handleEkycRetrieveWebhook(partner_order_id);
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("retrieve-working-idfy")
  @ApiOperation({ summary: "Retrieve e-KYC data from IDfy" })
  @ApiBody({ type: EkycRetrieveRequestDto })
  async retrieveEkyc(
     @Body() requestData: EkycRetrieveRequestDto
  ) {
    return this.ekycService.retrieveEkycData(requestData);
  }

  
  @Get("tasks")
  @ApiOperation({ summary: "Retrieve task details from IDfy" })
  @ApiHeader({
    name: "X-API-Key",
    description: "Authentication token",
    required: true,
  })
  @ApiQuery({
    name: "request_id",
    description: "Request ID to fetch task details",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Task details retrieved successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Task not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getTaskDetails(
    @Headers("X-API-Key") token: string,
    @Query("request_id") requestId: string
  ) {
    return this.ekycService.getTaskDetails(token, requestId);
  }

  @Get("merged-pdf")
  @ApiOperation({ summary: "Get Base64 of merged PDF for an order" })
  @ApiQuery({
    name: "orderId",
    required: true,
    description: "The ID of the order to fetch or merge PDFs for",
  })
  @ApiResponse({ status: 200, description: "Base64 string of the merged PDF" })
  @ApiResponse({
    status: 400,
    description: "Invalid request data or no PDFs found",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getMergedPdf(
    @Query("orderId") orderId: string
  ): Promise<{ success: boolean; data: string; message: string }> {
    try {
      const mergedPdfBase64 = await this.ekycService.getMergedPdfBase64(
        orderId
      );
      return {
        success: true,
        data: mergedPdfBase64.base64,
        message: "Merged PDF Base64 retrieved successfully",
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: error.details || error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // @Post("request-base64")
  // @ApiOperation({ summary: "Send an e-KYC request to IDfy" })
  // @ApiHeader({
  //   name: "X-API-Key",
  //   description: "Authentication token",
  //   required: true,
  // })
  // @ApiBody({ type: EkycRequestDto })
  // async sendEkyc(
  //   @Headers("X-API-Key") token: string,
  //   @Body() requestData: EkycRequestDto
  // ) {
  //   return this.ekycService.sendEkycRequestBase64(token, requestData);
  // }

  // @Post("convert-urls-to-base64")
  // @ApiOperation({
  //   summary: "Convert multiple file URLs to Base64",
  //   description:
  //     "Accepts an array of URLs, fetches the files, and returns their Base64-encoded content.",
  // })
  // @ApiBody({
  //   description: "Array of URLs to convert",
  //   type: ConvertUrlsToBase64Dto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Successfully converted URLs to Base64",
  //   schema: {
  //     example: {
  //       success: true,
  //       message: "URLs processed successfully",
  //       data: [
  //         {
  //           url: "https://example.com/file1.pdf",
  //           base64: "JVBERi0xLjQKJb...==",
  //           mimeType: "application/pdf",
  //         },
  //         {
  //           url: "https://example.com/file2.jpg",
  //           base64: "/9j/4AAQSkZJRg...==",
  //           mimeType: "image/jpeg",
  //         },
  //       ],
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: "Invalid input provided",
  //   schema: {
  //     example: {
  //       success: false,
  //       message: "URLs must be a non-empty array",
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: "Internal server error occurred",
  //   schema: {
  //     example: {
  //       success: false,
  //       message: "An unexpected error occurred",
  //       details: "Error details here",
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     },
  //   },
  // })
  // async convertUrlsToBase64(@Body() body: ConvertUrlsToBase64Dto) {
  //   if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
  //     throw new HttpException(
  //       "URLs must be a non-empty array",
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  //   return this.ekycService.convertUrlsToBase64(body.urls);
  // }
}
