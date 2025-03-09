import {
  Controller,
  Param,
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
} from "@nestjs/common";
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

class UploadPdfDto {
  orderId: string;
  documentTypeId: string;
  base64Pdf: string;
  mergeDoc?: boolean;
  // uploaded_by: string;
}

@ApiTags("Document Management")
@Controller("documents")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  

  @Post('upload')
  @Post('upload')
  @ApiOperation({ summary: 'Upload a PDF document by Order ID' })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        // documentTypeId: { type: 'string', example: 'agreement' },
        base64Pdf: { 
          type: 'string',
          example: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
          description: 'Base64 encoded PDF document'
        },
        mergeDoc: { type: 'boolean', example: false },
        // uploaded_by: { type: 'string', example: '987e4567-e89b-12d3-a456-426614174111' },
      },
      required: ['orderId', 'base64Pdf'],
    },
  })
  @ApiResponse({ status: 201, description: 'PDF document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid base64 format or order not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadDocument(@Body() uploadPdfDto: UploadPdfDto) {
    // Ensure only PDF files are allowed
    if (!uploadPdfDto.base64Pdf.startsWith('data:application/pdf;base64,')) {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // uploadPdfDto.documentTypeId,
    return this.pdfService.uploadDocumentByOrderId(
      uploadPdfDto.orderId,
      uploadPdfDto.base64Pdf,
      uploadPdfDto.mergeDoc,
      // uploadPdfDto.uploaded_by
    );
  }


  @Post("upload-file")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Upload a file to AWS S3 under a specified order_id folder",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "File to upload",
        },
        order_id: {
          type: "string",
          description: "Order ID to use as folder name",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "File uploaded successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("order_id") orderId: string
  ) {
    if (!file) throw new BadRequestException("File is required");
    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      throw new BadRequestException(
        "Order ID is required and must be a non-empty string"
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.uploadFile(
      file.buffer,
      file.originalname,
      folderName
    );
  }

  @Get("list-by-order")
  @ApiOperation({
    summary:
      "List all files in an order_id folder from AWS S3 with signed URLs",
  })
  @ApiQuery({
    name: "order_id",
    required: true,
    description: "Order ID to list files from its folder",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved list of files with signed URLs",
    schema: {
      type: "object",
      properties: {
        order_id: { type: "string", description: "Order ID folder" },
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
  async listFilesByOrderId(@Query("order_id") orderId: string) {
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
    summary: "Merge all PDFs in an order_id folder and upload to AWS S3",
  })
  @ApiQuery({
    name: "order_id",
    required: true,
    description: "Order ID folder containing PDFs to merge",
  })
  @ApiResponse({ status: 201, description: "Merged PDF uploaded successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async mergeFilesByOrderId(@Query("order_id") orderId: string) {
    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      throw new BadRequestException(
        "Order ID is required and must be a non-empty string"
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.mergeFilesByFolder(folderName);
  }

  @Put("update")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary:
      "Update an existing file in an order_id folder in AWS S3 with a new file",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "New file to replace the existing one",
        },
        order_id: {
          type: "string",
          description: "Order ID folder containing the file",
        },
        file_name: {
          type: "string",
          description:
            'Name of the existing file to update (e.g., "1741154856501_bmf_flow_api.pdf")',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: "File updated successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "File not found" })
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("order_id") orderId: string,
    @Body("file_name") fileName: string
  ) {
    if (!file) throw new BadRequestException("File is required");
    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      throw new BadRequestException(
        "Order ID is required and must be a non-empty string"
      );
    }
    if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
      throw new BadRequestException(
        "File name is required and must be a non-empty string"
      );
    }
    const folderName = orderId.trim();
    const oldFileKey = `${folderName}/${fileName.trim()}`;
    const newFileKey = `${folderName}/${file.originalname}`; // Use uploaded file's original name
    return await this.pdfService.updateFile(
      file.buffer,
      oldFileKey,
      newFileKey,
      file.mimetype
    );
  }

  @Delete("delete")
  @ApiOperation({ summary: "Delete a file from an order_id folder in AWS S3" })
  @ApiQuery({
    name: "order_id",
    required: true,
    description: "Order ID folder containing the file",
  })
  @ApiQuery({
    name: "file_name",
    required: true,
    description: 'Name of the file to delete (e.g., "123.html")',
  })
  @ApiResponse({ status: 200, description: "File deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "File not found" })
  async deleteFile(
    @Query("order_id") orderId: string,
    @Query("file_name") fileName: string
  ) {
    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      throw new BadRequestException(
        "Order ID is required and must be a non-empty string"
      );
    }
    if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
      throw new BadRequestException(
        "File name is required and must be a non-empty string"
      );
    }
    const folderName = orderId.trim();
    const fileKey = `${folderName}/${fileName.trim()}`;
    return await this.pdfService.deleteFile(fileKey);
  }

  // @Get(':folderName/:fileName')
  // async serveDocument(
  //   @Param('folderName') folderName: string,
  //   @Param('fileName') fileName: string,
  //   @Res() res: Response,
  // ) {
  //   const fileStream = await this.pdfService.serveDocument(folderName, fileName);
  //   res.setHeader('Content-Type', 'application/pdf');
  //   fileStream.pipe(res);
  // }
}
