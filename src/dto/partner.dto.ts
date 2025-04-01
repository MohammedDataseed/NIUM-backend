import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

export enum business_type {
  LARGE_ENTERPRISE = 'large_enterprise',
  CASH_CARRY = 'cash&carry', // ✅ Updated value for better JSON compatibility
}

export class CreatePartnerDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Role ID (UUID)',
  })
  @IsUUID()
  role_id: string;

  @ApiProperty({
    example: 'partner@example.com',
    description: "Partner's email address",
  })
  @IsString()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the partner' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the partner' })
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: "Partner's hashed password",
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the partner is active',
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: 'hashed_key',
    description: 'hashed_key for saving',
  })
  @IsString()
  @IsOptional()
  hashed_key?: string; // Make it optional

  @ApiPropertyOptional({
    example: 'apikey-12345',
    description: 'API Key for authentication',
  })
  @IsString()
  @IsOptional()
  api_key?: string;

  @ApiProperty({
    example: 'large_enterprise',
    enum: business_type,
    description: 'Business type',
  })
  @IsEnum(business_type)
  business_type: business_type;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Created by user ID (UUID)',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Updated by user ID (UUID)',
  })
  @IsUUID()
  updated_by: string;

  @ApiPropertyOptional({
    example: [
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
    ],
    description: 'Array of product IDs (UUIDs)',
  })
  @IsArray()
  @IsUUID('4', { each: true }) // ✅ Specified UUID v4 for validation
  @IsOptional()
  product_ids?: string[];
}

export class UpdatePartnerDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Role ID (UUID)',
  })
  @IsUUID()
  @IsOptional()
  role_id?: string;

  @ApiPropertyOptional({
    example: 'partner@example.com',
    description: "Partner's email address",
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'First name of the partner',
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the partner',
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({
    example: 'hashedpassword123',
    description: "Partner's hashed password",
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'apikey-12345',
    description: 'API Key for authentication',
  })
  @IsString()
  @IsOptional()
  api_key?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the partner is active',
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: 'large_enterprise',
    enum: business_type,
    description: 'Business type',
  })
  @IsEnum(business_type)
  @IsOptional()
  business_type?: business_type;

  @ApiPropertyOptional({
    example: 'hashed_key',
    description: 'hashed_key for saving',
  })
  @IsString()
  @IsOptional()
  hashed_key?: string; // Make it optional

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Updated by user ID (UUID)',
  })
  @IsUUID()
  @IsOptional()
  updated_by?: string;

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440003'],
    description: 'List of associated product IDs',
  })
  @IsArray()
  @IsUUID('4', { each: true }) // ✅ Specified UUID v4 for validation
  @IsOptional()
  product_ids?: string[];
}

class ProductResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'Product ID (UUID)',
  })
  id: string;

  @ApiProperty({ example: 'Product A', description: 'Product Name' })
  name: string;
}

export class PartnerResponseDto {
  @ApiProperty({
    example: 'uuid',
    description: 'Unique primary key for the partner',
  })
  @IsString()
  partner_id: string; // ✅ Added `@IsString()` for validation

  @ApiProperty({
    example: 'a1b2c3d4e5f6...',
    description: 'Unique hashed key for the partner',
  })
  @IsString()
  hashed_key: string; // ✅ Added `@IsString()` for validation

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Role ID (UUID)',
  })
  role_id: string;

  @ApiProperty({
    example: 'partner@example.com',
    description: "Partner's email address",
  })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the partner' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the partner' })
  last_name: string;

  @ApiProperty({
    example: 'apikey-12345',
    description: 'API Key for authentication',
  })
  api_key: string;

  @ApiProperty({ example: true, description: 'Whether the partner is active' })
  is_active: boolean;

  @ApiProperty({
    example: 'large_enterprise',
    enum: business_type,
    description: 'Business type',
  })
  business_type: business_type;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Created by user ID (UUID)',
  })
  created_by: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Updated by user ID (UUID)',
  })
  updated_by: string;

  @ApiProperty({
    type: [ProductResponseDto], // ✅ Updated to return full product details
    description: 'Array of associated products',
  })
  products: ProductResponseDto[];
}
