import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Product A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a great product.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the product is active or not',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'User ID associated with the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'User ID of the creator of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the product',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Updated Product A',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a new version of the product.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the product is active or not',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'User ID of the last user who updated the product',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class ProductDto {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Product A',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a great product.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the product is active or not',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Timestamp of when the product was created',
    example: '2025-02-17T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the product was last updated',
    example: '2025-02-17T12:34:56Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID associated with the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'User ID of the creator of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the product',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}
