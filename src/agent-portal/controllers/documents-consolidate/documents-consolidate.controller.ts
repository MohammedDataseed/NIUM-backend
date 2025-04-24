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
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { OrdersService } from '../../services/order/order.service';
import * as opentracing from 'opentracing';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PdfService } from '../../services/document-consolidate/document-consolidate.service';
import { Express } from 'express';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
const s3 = new S3Client({ region: process.env.AWS_REGION });
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

@ApiTags('Document Management')
@Controller('documents')
export class PdfController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a PDF document by Order ID' })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        partner_order_id: {
          type: 'string',
          example: 'BMFORDERID786',
        },
        document_type_id: {
          type: 'string',
          example: '9aae975b52a0803109e4538a0bafd3e9m84deewb',
        },
        base64_file: {
          type: 'string',
          example: 'JVBERi0xLjQKJ...', // Pure Base64 string (no prefix)
          description: 'Base64 encoded document',
        },
        merge_doc: { type: 'boolean', example: false },
      },
      required: ['orderId', 'document_type_id', 'base64_file', 'merge_doc'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'PDF document uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid base64 format or order not found',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadDocument(
    @Headers('api_key') api_key: string,
    @Headers('partner_id') partner_id: string,

    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    uploadPdfDto: UploadPdfDto,
  ) {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('upload-document-controller');
    try {
      console.log(partner_id, api_key);
      await this.ordersService.validatePartnerHeaders(partner_id, api_key);

      const { partner_order_id, document_type_id, base64_file, merge_doc } =
        uploadPdfDto;

      if (!partner_order_id || !document_type_id || !base64_file) {
        throw new BadRequestException('Missing required fields.');
      }

      // Ensure base64 string does not contain "data:application/pdf;base64,"
      const pureBase64 = base64_file.replace(
        /^data:application\/pdf;base64,/,
        '',
      );

      // Call service to upload document
      const uploadedDocument = await this.pdfService.uploadDocumentByOrderId(
        partner_id,
        partner_order_id,
        document_type_id,
        pureBase64,
        merge_doc,
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

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary:
      'Upload a file to AWS S3 under a specified partner_order_id folder',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        partner_order_id: {
          type: 'string',
          description: 'partner Order ID to use as folder name',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('partner_order_id') orderId: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException(
        'Order ID is required and must be a non-empty string',
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.uploadFile(
      file.buffer,
      file.originalname,
      folderName,
    );
  }

  @Get('list-by-order')
  @ApiOperation({
    summary:
      'List all files in an partner_order_id folder from AWS S3 with signed URLs',
  })
  @ApiQuery({
    name: 'partner_order_id',
    required: true,
    description: 'Order ID to list files from its folder',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of files with signed URLs',
    schema: {
      type: 'object',
      properties: {
        partner_order_id: { type: 'string', description: 'Order ID folder' },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'File name' },
              signed_url: {
                type: 'string',
                description: 'Signed URL to access the file',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listFilesByOrderId(@Query('partner_order_id') orderId: string) {
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException(
        'Order ID is required and must be a non-empty string',
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.listFilesByFolder(folderName);
  }

  @Post('merge-by-order')
  @ApiOperation({
    summary:
      'Merge all PDFs in an partner_order_id folder and upload to AWS S3',
  })
  @ApiQuery({
    name: 'partner_order_id',
    required: true,
    description: 'Order ID folder containing  to merge',
  })
  @ApiResponse({ status: 201, description: 'Merged uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async mergeFilesByOrderId(@Query('partner_order_id') orderId: string) {
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException(
        'Order ID is required and must be a non-empty string',
      );
    }
    const folderName = orderId.trim();
    return await this.pdfService.mergeFilesByFolder(folderName);
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary:
      'Update an existing file in an partner_order_id folder in AWS S3 with a new file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'New file to replace the existing one',
        },
        partner_order_id: {
          type: 'string',
          description: 'Order ID folder containing the file',
        },
        file_name: {
          type: 'string',
          description:
            'Name of the existing file to update (e.g., "1741154856501_bmf_flow_api.pdf")',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('partner_order_id') orderId: string,
    @Body('file_name') fileName: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException(
        'Order ID is required and must be a non-empty string',
      );
    }
    if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
      throw new BadRequestException(
        'File name is required and must be a non-empty string',
      );
    }
    const folderName = orderId.trim();
    const oldFileKey = `${folderName}/${fileName.trim()}`;
    const newFileKey = `${folderName}/${file.originalname}`; // Use uploaded file's original name
    return await this.pdfService.updateFile(
      file.buffer,
      oldFileKey,
      newFileKey,
      file.mimetype,
    );
  }

  @Delete('delete')
  @ApiOperation({
    summary: 'Delete a file from an partner_order_id folder in AWS S3',
  })
  @ApiQuery({
    name: 'partner_order_id',
    required: true,
    description: 'Order ID folder containing the file',
  })
  @ApiQuery({
    name: 'file_name',
    required: true,
    description: 'Name of the file to delete (e.g., "123.html")',
  })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(
    @Query('partner_order_id') orderId: string,
    @Query('file_name') fileName: string,
  ) {
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException(
        'Order ID is required and must be a non-empty string',
      );
    }
    if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
      throw new BadRequestException(
        'File name is required and must be a non-empty string',
      );
    }
    const folderName = orderId.trim();
    const fileKey = `${folderName}/${fileName.trim()}`;
    return await this.pdfService.deleteFile(fileKey);
  }

  @Get('esign/:folder/:filename')
  async getMergedPdf(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const bucket = process.env.BUCKET_NAME;
    const key = `${folder}/${filename}`;

    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const s3Response: GetObjectCommandOutput = await s3.send(command);

      if (!s3Response.Body) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      // Set correct headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);

      // Stream directly from S3 to response
      (s3Response.Body as Readable).pipe(res);
    } catch (error) {
      console.error('Error fetching file from S3:', error);
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
