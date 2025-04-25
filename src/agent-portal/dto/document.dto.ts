import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class DocumentUploadDto {
  @ApiProperty({
    description: 'BMF order ID',
    example: 'BMFORDERID4321',
  })
  @IsString()
  order_id: string;

  @ApiProperty({
    description: 'Document type ID from /config?type=document_type',
    example: '051d5bae-1826-4c67-8c51-2c5a8e3ee042',
  })
  @IsUUID()
  document_type_id: string;

  @ApiProperty({
    description: 'Base64-encoded image (size < 1MB)',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...',
  })
  @IsString()
  @MaxLength(1_048_576, { message: 'Base64 image must be less than 1MB' }) // Rough check; refined in service
  base64_image: string;

  @ApiProperty({
    description: 'Whether to merge with existing documents (default: false)',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  merge_doc?: boolean;
}
