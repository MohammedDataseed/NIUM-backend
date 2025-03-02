import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
} from "class-validator";

export class CreatePartnerDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Role ID (UUID)",
  })
  @IsUUID()
  role_id: string;

  @ApiProperty({
    example: "partner@example.com",
    description: "Partner's email address",
  })
  @IsString()
  email: string;

  @ApiProperty({ example: "John", description: "First name of the partner" })
  @IsString()
  first_name: string;

  @ApiProperty({ example: "Doe", description: "Last name of the partner" })
  @IsString()
  last_name: string;

  @ApiProperty({
    example: "hashedpassword123",
    description: "Partner's hashed password",
  })
  @IsString()
  password: string; // Should be hashed before saving

  @ApiProperty({
    example: "apikey-12345",
    description: "API Key for authentication",
  })
  @IsString()
  api_key: string;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the partner is active",
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: "large_enterprise",
    enum: ["large_enterprise", "cash&carry"],
    description: "Business type",
  })
  @IsEnum(["large_enterprise", "cash&carry"])
  business_type: "large_enterprise" | "cash&carry";

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440001",
    description: "Created by user ID (UUID)",
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440002",
    description: "Updated by user ID (UUID)",
  })
  @IsUUID()
  updated_by: string;

  @ApiProperty({
    example: [
      "550e8400-e29b-41d4-a716-446655440003",
      "550e8400-e29b-41d4-a716-446655440004",
    ],
    description: "Array of product IDs (UUIDs)",
  })
  
  @ApiPropertyOptional({ example: ["550e8400-e29b-41d4-a716-446655440003"], description: "List of associated product IDs" })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  productIds?: string[];
}

export class UpdatePartnerDto {
  @ApiPropertyOptional({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Role ID (UUID)",
  })
  @IsUUID()
  @IsOptional()
  role_id?: string;

  @ApiPropertyOptional({
    example: "partner@example.com",
    description: "Partner's email address",
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: "John",
    description: "First name of the partner",
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({
    example: "Doe",
    description: "Last name of the partner",
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({
    example: "hashedpassword123",
    description: "Partner's hashed password",
  })
  @IsString()
  @IsOptional()
  password?: string; // Should be hashed before updating

  @ApiPropertyOptional({
    example: "apikey-12345",
    description: "API Key for authentication",
  })
  @IsString()
  @IsOptional()
  api_key?: string;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the partner is active",
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: "large_enterprise",
    enum: ["large_enterprise", "cash&carry"],
    description: "Business type",
  })
  @IsEnum(["large_enterprise", "cash&carry"])
  @IsOptional()
  business_type?: "large_enterprise" | "cash&carry";

  @ApiPropertyOptional({
    example: "550e8400-e29b-41d4-a716-446655440002",
    description: "Updated by user ID (UUID)",
  })
  @IsUUID()
  @IsOptional()
  updated_by?: string;

  
  @ApiPropertyOptional({ example: ["550e8400-e29b-41d4-a716-446655440003"], description: "List of associated product IDs" })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  productIds?: string[];
}
