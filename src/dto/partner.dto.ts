import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
} from "class-validator";

// Define Enum for Business Type (Best Practice)
enum BusinessType {
  LARGE_ENTERPRISE = "large_enterprise",
  CASH_CARRY = "cash&carry",
}

export class CreatePartnerDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000", description: "Role ID (UUID)" })
  @IsUUID()
  role_id: string;

  @ApiProperty({ example: "partner@example.com", description: "Partner's email address" })
  @IsString()
  email: string;

  @ApiProperty({ example: "John", description: "First name of the partner" })
  @IsString()
  first_name: string;

  @ApiProperty({ example: "Doe", description: "Last name of the partner" })
  @IsString()
  last_name: string;

  @ApiProperty({ example: "hashedpassword123", description: "Partner's hashed password" })
  @IsString()
  password: string; // Should be hashed before saving

  @ApiPropertyOptional({ example: true, description: "Whether the partner is active" })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: "apikey-12345", description: "API Key for authentication" })
  @IsString()
  @IsOptional()
  api_key?: string;

  @ApiProperty({ example: "large_enterprise", enum: BusinessType, description: "Business type" })
  @IsEnum(BusinessType)
  business_type: BusinessType;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001", description: "Created by user ID (UUID)" })
  @IsUUID()
  created_by: string;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440002", description: "Updated by user ID (UUID)" })
  @IsUUID()
  updated_by: string;

  @ApiPropertyOptional({
    example: ["550e8400-e29b-41d4-a716-446655440003", "550e8400-e29b-41d4-a716-446655440004"],
    description: "Array of product IDs (UUIDs)",
  })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  productIds?: string[];
}

export class UpdatePartnerDto {
  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440000", description: "Role ID (UUID)" })
  @IsUUID()
  @IsOptional()
  role_id?: string;

  @ApiPropertyOptional({ example: "partner@example.com", description: "Partner's email address" })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: "John", description: "First name of the partner" })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({ example: "Doe", description: "Last name of the partner" })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ example: "hashedpassword123", description: "Partner's hashed password" })
  @IsString()
  @IsOptional()
  password?: string; // Should be hashed before updating

  @ApiPropertyOptional({ example: "apikey-12345", description: "API Key for authentication" })
  @IsString()
  @IsOptional()
  api_key?: string;

  @ApiPropertyOptional({ example: true, description: "Whether the partner is active" })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: "large_enterprise", enum: BusinessType, description: "Business type" })
  @IsEnum(BusinessType)
  @IsOptional()
  business_type?: BusinessType;

  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440002", description: "Updated by user ID (UUID)" })
  @IsUUID()
  @IsOptional()
  updated_by?: string;

  @ApiPropertyOptional({
    example: ["550e8400-e29b-41d4-a716-446655440003"],
    description: "List of associated product IDs",
  })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  productIds?: string[];
}
