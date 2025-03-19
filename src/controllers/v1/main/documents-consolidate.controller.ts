import {
  Controller,
  Param,
  Headers,
  Res,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";
import { OrdersService } from "../../../services/v1/order/order.service";

import * as opentracing from "opentracing";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { PdfService } from "../../../services/v1/document-consolidate/document-consolidate.service";
import { Express } from "express";
import { IsString, IsBoolean, IsNotEmpty } from "class-validator";

export class UploadPdfDto {
  @IsString()
  @IsNotEmpty()
  partner_order_id: string;

  @IsString()
  @IsNotEmpty()
  document_type_id: string;

  @IsString()
  @IsNotEmpty()
  base64_file: string;

  @IsBoolean()
  merge_doc: boolean;
}


@ApiTags("Document Management")
@Controller("documents")
export class PdfController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService
  ) {}

  @Post("upload")
  @ApiOperation({ summary: "Upload a PDF document by Order ID" })
  @ApiConsumes("application/json")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        partner_order_id: {
          type: "string",
          example: "BMFORDERID786",
        },
        document_type_id: {
          type: "string",
          example: "9aae975b52a0803109e4538a0bafd3e9m84deewb",
        },
        base64_file: {
          type: "string",
          example: "JVBERi0xLjQKJ...", // Pure Base64 string (no prefix)
          description: "Base64 encoded document",
        },
        merge_doc: { type: "boolean", example: false },
      },
      required: ["orderId", "document_type_id", "base64_file", "merge_doc"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "PDF document uploaded successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid base64 format or order not found",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async uploadDocument(
    @Headers("api_key") api_key: string,
    @Headers("partner_id") partner_id: string,

    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    uploadPdfDto: UploadPdfDto
  ) {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("upload-document-controller");
    try {
      await this.ordersService.validatePartnerHeaders(partner_id, api_key);

      const { partner_order_id, document_type_id, base64_file, merge_doc } =
        uploadPdfDto;

      if (!partner_order_id || !document_type_id || !base64_file) {
        throw new BadRequestException("Missing required fields.");
      }

      // Ensure base64 string does not contain "data:application/pdf;base64,"
      const pureBase64 = base64_file.replace(
        /^data:application\/pdf;base64,/,
        ""
      );

      // Call service to upload document
      const uploadedDocument = await this.pdfService.uploadDocumentByOrderId(
        partner_order_id,
        document_type_id,
        pureBase64,
        merge_doc
      );

      return uploadedDocument;

      // return {
      //   message: "File uploaded successfully",
      //   document_id: `${partner_order_id}_${document_type_id}`,
      //   // documentUrl: uploadedDocument.document_url, // Ensure this matches the service response
      // };
    } catch (error) {
      throw error;
    } finally {
      span.finish();
    }
  }

  @Get("list-by-order")
  @ApiOperation({
    summary:
      "List all files in an partner_order_id folder from AWS S3 with signed URLs",
  })
  @ApiQuery({
    name: "partner_order_id",
    required: true,
    description: "Order ID to list files from its folder",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved list of files with signed URLs",
    schema: {
      type: "object",
      properties: {
        partner_order_id: { type: "string", description: "Order ID folder" },
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "File name" },
              signed_url: {
                type: "string",
                description: "Signed URL to access the file",
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async listFilesByOrderId(@Query("partner_order_id") orderId: string) {
    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      throw new BadRequestException(
        "Order ID is required and must be a non-empty string"
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.listFilesByFolder(folderName);
  }

  @Post("merge-by-order")
  @ApiOperation({
    summary:
      "Merge all PDFs in an partner_order_id folder and upload to AWS S3",
  })
  @ApiQuery({
    name: "partner_order_id",
    required: true,
    description: "Order ID folder containing  to merge",
  })
  @ApiResponse({ status: 201, description: "Merged uploaded successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async mergeFilesByOrderId(@Query("partner_order_id") orderId: string) {
    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      throw new BadRequestException(
        "Order ID is required and must be a non-empty string"
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.mergeFilesByFolder(folderName);
  }


}
