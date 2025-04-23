import {
  UseGuards,
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DocumentTypeService } from '../../../services/v1/document/documentType.service';
import { DocumentType } from '../../../database/models/documentType.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from '../../../dto/documentType.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('DocumentTypes')
@Controller('documentTypes')
@ApiBearerAuth('access_token')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() params: Record<string, any>,
  ): Promise<Array<{ document_type_id: string; document_name: string }>> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-document-types-request');

    try {
      const whereCondition: WhereOptions<DocumentType> =
        params as WhereOptions<DocumentType>;
      const documentTypes = await this.documentTypeService.findAll(
        span,
        whereCondition,
      );

      return documentTypes.map((doc) => ({
        document_type_id: doc.hashed_key, // Ensures UUID compatibility
        document_name: doc.name,
      }));
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new document type' })
  @ApiResponse({
    status: 201,
    description: 'The document type has been successfully created.',
    type: DocumentType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  async createDocumentType(
    @Body() createDocumentTypeDto: CreateDocumentTypeDto,
  ): Promise<{ document_type_id: string; document_name: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-document-type-request');

    try {
      const newDocument = await this.documentTypeService.createDocumentType(
        span,
        createDocumentTypeDto,
      );
      return {
        document_type_id: newDocument.hashed_key,
        document_name: newDocument.name,
      };
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Put(':document_type_id')
  @ApiOperation({ summary: 'Update a document type' })
  @ApiResponse({
    status: 200,
    description: 'Document Type updated successfully.',
    type: DocumentType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  @ApiResponse({ status: 404, description: 'Document Type not found.' })
  @ApiBody({ type: UpdateDocumentTypeDto })
  async update(
    @Param('document_type_id') document_type_id: string,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-document-type-request');

    try {
      await this.documentTypeService.updateDocumentType(
        span,
        document_type_id,
        updateDocumentTypeDto,
      );
      return { message: 'Document Type updated successfully' };
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':document_type_id')
  @ApiOperation({ summary: 'Delete a document type' })
  @ApiResponse({
    status: 200,
    description: 'Document Type deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Document Type not found.' })
  async delete(
    @Param('document_type_id') document_type_id: string,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-document-type-request');

    try {
      await this.documentTypeService.deleteDocumentType(span, document_type_id);
      return { message: 'Document Type deleted successfully' };
    } finally {
      span.finish();
    }
  }
}
