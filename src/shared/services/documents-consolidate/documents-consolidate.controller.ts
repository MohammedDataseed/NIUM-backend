import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PdfService } from './documents-consolidate.service';
import { Express } from 'express';

@ApiTags('Document Management')
@Controller('documents')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}


  /**
   * Upload a single file to AWS S3 under a specific folder
   */
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiOperation({ summary: 'Upload a file to AWS S3 under "documents" folder' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: { type: 'string', format: 'binary', description: 'File to upload' },
  //     },
  //   },
  // })
  // @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //  ) {
  //   if (!file) throw new BadRequestException('File is required');
  //   return await this.pdfService.uploadFile(file.buffer, file.originalname, 'documents'); // Fixed folder "documents"
  // }

  @Post('upload')
@UseInterceptors(FileInterceptor('file'))
@ApiOperation({ summary: 'Upload a file to AWS S3 under a specified order_id folder' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary', description: 'File to upload' },
      order_id: { type: 'string', description: 'Order ID to use as folder name' },
    },
  },
})
@ApiResponse({ status: 201, description: 'File uploaded successfully' })
@ApiResponse({ status: 400, description: 'Bad Request' })
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body('order_id') orderId: string, // Add order_id as a body parameter
) {
  if (!file) throw new BadRequestException('File is required');
  if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
    throw new BadRequestException('Order ID is required and must be a non-empty string');
  }
  const folderName = orderId.trim(); // Use order_id as folder name
  return await this.pdfService.uploadFile(file.buffer, file.originalname, folderName);
}


@Get('list-by-order')
  @ApiOperation({ summary: 'List all files in an order_id folder from AWS S3 with signed URLs' })
  @ApiQuery({ name: 'order_id', required: true, description: 'Order ID to list files from its folder' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of files with signed URLs',
    schema: {
      type: 'object',
      properties: {
        order_id: { type: 'string', description: 'Order ID folder' },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'File name' },
              signed_url: { type: 'string', description: 'Signed URL to access the file' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listFilesByOrderId(@Query('order_id') orderId: string) {
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException('Order ID is required and must be a non-empty string');
    }
    const folderName = orderId.trim();
    return await this.pdfService.listFilesByFolder(folderName);
  }


 
  
  @Post('merge-by-order')
  @ApiOperation({ summary: 'Merge all PDFs in an order_id folder and upload to AWS S3' })
  @ApiQuery({ name: 'order_id', required: true, description: 'Order ID folder containing PDFs to merge' })
  @ApiResponse({ status: 201, description: 'Merged PDF uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async mergeFilesByOrderId(@Query('order_id') orderId: string) {
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      throw new BadRequestException('Order ID is required and must be a non-empty string');
    }
    const folderName = orderId.trim();
    return await this.pdfService.mergeFilesByFolder(folderName);
  }

}