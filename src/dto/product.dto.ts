import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'This is a product description.',
    description: 'Description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the product is active or not',
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'User ID of the creator',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'User ID of the last updater',
  })
  @IsUUID()
  updated_by: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Product Name',
    description: 'Updated name of the product',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated product description.',
    description: 'Updated description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the product is active or not',
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'User ID of the last updater',
  })
  @IsUUID()
  @IsOptional()
  updated_by?: string;
}
