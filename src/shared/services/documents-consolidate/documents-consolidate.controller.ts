//documents-consolidate.controller.ts

import { 
    Controller, Post, Get, Body, Query, UploadedFile, UseInterceptors, BadRequestException 
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
  import { PdfService } from './documents-consolidate.service';
  import { Express } from 'express';


  @ApiTags('Document Management') // Group all endpoints under "PDF Management"
  @Controller('documents')
  export class PdfController {
    constructor(private readonly pdfService: PdfService) {}
  
    @Get('list')
    @ApiOperation({ summary: 'List folders and files from DigitalOcean Spaces' })
    @ApiQuery({ name: 'path', required: true, description: 'Folder path to list contents' })
    @ApiQuery({ name: 'role', required: true, enum: ['client', 'admin'], description: 'User role' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved list' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getAllFoldersAndFiles(@Query('path') path: string, @Query('role') role: string) {
      return await this.pdfService.getAllFoldersAndFiles(path, role);
    }
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload a file to DigitalOcean Spaces' })
    @ApiConsumes('multipart/form-data')
    @ApiQuery({ name: 'folderPath', required: true, description: 'Folder path to upload file' })
    @ApiQuery({ name: 'role', required: true, enum: ['client', 'admin'], description: 'User role' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,

      @Query('folderPath') folderPath: string,
      @Query('role') role: string,
    ) {
      if (!file) throw new BadRequestException('File is required');
      return await this.pdfService.uploadFile(file.buffer, file.originalname, folderPath, role);
    }
  
    @Post('merge')
    @ApiOperation({ summary: 'Merge multiple PDFs and upload to DigitalOcean Spaces' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          documents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                aadhar_url: { type: 'string', description: 'Aadhar PDF URL' },
                base64_image1: { type: 'string', description: 'Base64 image URL' },
                esign_file: { type: 'string', description: 'E-Sign file URL' },
              },
            },
          },
          clientName: { type: 'string', description: 'Client Name' },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'Merged PDF uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async mergeAndUploadPDF(
      @Body() body: { documents: { aadhar_url: string; base64_image1: string; esign_file: string }[]; clientName: string }
    ) {
      // Pass the `documents` array as it is
      return await this.pdfService.mergeAndUploadPDF(body.documents, body.clientName);
    }
    
  }
  