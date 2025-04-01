import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentType } from '../../../database/models/documentType.model';
import * as opentracing from 'opentracing';
import {
  DocumentTypeDto,
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from '../../../dto/documentType.dto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class DocumentTypeService {
  constructor(
    @Inject('DOCUMENT_TYPE_REPOSITORY')
    private readonly documentTypeRepository: typeof DocumentType,
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<DocumentType>,
  ): Promise<DocumentType[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.documentTypeRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createDocumentType(
    span: opentracing.Span,
    createDocumentTypeDto: CreateDocumentTypeDto,
  ): Promise<DocumentType> {
    const childSpan = span
      .tracer()
      .startSpan('create-document-type', { childOf: span });

    try {
      // Check if document type already exists
      const existingDocumentType = await this.documentTypeRepository.findOne({
        where: { name: createDocumentTypeDto.document_name },
      });
      if (existingDocumentType) {
        throw new ConflictException('Document Type already exists');
      }

      console.log('Received DTO:', createDocumentTypeDto); // Debugging log

      // Ensure all required fields are passed to create()
      return await this.documentTypeRepository.create({
        name: createDocumentTypeDto.document_name,
        created_by: createDocumentTypeDto.created_by, // Ensure UUIDs are provided
        updated_by: createDocumentTypeDto.updated_by,
      });
    } finally {
      childSpan.finish();
    }
  }

  async updateDocumentType(
    span: opentracing.Span,
    hashed_key: string,
    updateDocumentTypeDto: UpdateDocumentTypeDto,
  ): Promise<DocumentType> {
    const childSpan = span
      .tracer()
      .startSpan('update-document-type', { childOf: span });

    try {
      // Find the document type by hashed_key
      const documentType = await this.documentTypeRepository.findOne({
        where: { hashed_key },
      });
      if (!documentType) {
        throw new NotFoundException('Document Type not found');
      }

      // Check if the updated name already exists for another document type
      if (updateDocumentTypeDto.document_name) {
        const existingDocumentType = await this.documentTypeRepository.findOne({
          where: { name: updateDocumentTypeDto.document_name },
        });

        if (
          existingDocumentType &&
          existingDocumentType.hashed_key !== hashed_key
        ) {
          throw new ConflictException(
            'Another Document Type with the same name already exists',
          );
        }
      }

      // Update document type
      await documentType.update({
        name: updateDocumentTypeDto.document_name ?? documentType.name, // Keep existing value if not provided
        isActive: updateDocumentTypeDto.is_active ?? documentType.isActive,
        updated_by: updateDocumentTypeDto.updated_by ?? documentType.updated_by,
      });

      return documentType;
    } finally {
      childSpan.finish();
    }
  }

  async findAllConfig(): Promise<{ id: string; text: string }[]> {
    const document = await this.documentTypeRepository.findAll({
      where: { isActive: true }, // Only fetch active documents
    });
    return document.map((document) => ({
      id: document.hashed_key,
      text: document.name,
    }));
  }

  async deleteDocumentType(
    span: opentracing.Span,
    hashed_key: string,
  ): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const documentType = await this.documentTypeRepository.findOne({
        where: { hashed_key },
      });
      if (!documentType) throw new NotFoundException('Document Type not found');

      await documentType.destroy();
      childSpan.log({
        event: 'documentType_deleted',
        document_type_id: hashed_key,
      });
    } finally {
      childSpan.finish();
    }
  }
}
