import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateDocumentTypeDto {
  @ApiProperty({
    description: 'Name of the document type',
    example: 'PAN',
  })
  @IsString()
  document_name: string;

  @ApiProperty({
    description: 'User ID of the creator of the document type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the document type',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class UpdateDocumentTypeDto {
  @ApiProperty({
    description: 'Name of the Document Type',
    example: 'PAN',
    required: false,
  })
  @IsString()
  @IsOptional()
  document_name?: string;

  @ApiProperty({
    description: 'Status of the document type (active/inactive)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'User ID of the last user who updated the document type',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class DocumentTypeDto {
  @ApiProperty({
    description: 'Unique identifier of the document type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Name of the branch',
    example: 'Main Branch',
  })
  document_name: string;

  @ApiProperty({
    description: 'Timestamp of when the document type was created',
    example: '2025-02-17T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the document type was last updated',
    example: '2025-02-17T12:34:56Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID of the creator of the document type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the document type',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}
