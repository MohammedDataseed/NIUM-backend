import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email (unique)',
    example: 'maker@dataseedtech.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'user@123#' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Role ID',
    example: 'e89c53de-7d2e-4a10-bf75-24a6675f3f18',
  })
  // @IsUUID()
  role_id: string;

  @ApiProperty({
    description: 'Business type',
    example: 'large_enterprise',
    enum: ['cash&carry', 'large_enterprise'],
  })
  @IsEnum(['cash&carry', 'large_enterprise'])
  bussiness_type: string;

  @ApiProperty({
    description: 'Branch ID',
    example: '7cfa494d-ea85-496d-92ec-0a35a359e556',
  })
  // @IsUUID()
  branch_id: string;

  @ApiProperty({
    description: 'Bank Account ID',
    example: 'd72a81fd-b897-4eb6-9e13-3e4b774a63d4',
  })
  // @IsUUID()
  @IsOptional()
  bank_account_id?: string;

  // @ApiProperty({ description: "Product ID", example: "ce496d0f-b8d4-4fb1-bc42-00b184e0da13" })
  // @IsUUID()
  // product_id: string;

  // @ApiProperty({ description: "Created by user ID", example: "9ab32de9-9020-4cde-8ef3-285c59f94d9f" })
  // @IsUUID()
  // created_by: string;

  // @ApiProperty({ description: "Updated by user ID", example: "9ab32de9-9020-4cde-8ef3-285c59f94d9f" })
  // @IsUUID()
  // updated_by: string;

  @ApiProperty({ description: 'Is Active', example: true })
  @IsBoolean()
  is_active: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'updatedemail@dataseedtech.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '333cd780-af26-42f4-b9f5-0934fcf8936f',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  role_id?: string;

  @ApiProperty({
    example: 'cash&carry',
    required: false,
    enum: ['cash&carry', 'large_enterprise'],
  })
  @IsEnum(['cash&carry', 'large_enterprise'])
  @IsOptional()
  bussiness_type?: string;

  @ApiProperty({
    example: '7cfa494d-ea85-496d-92ec-0a35a359e556',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  branch_id?: string;

  // @ApiProperty({ example: "bc7cb89f-56b0-4bc6-9e22-80c0d55dc754", required: false })
  // @IsUUID()
  // @IsOptional()
  // product_id?: string;

  @ApiProperty({
    example: 'bc7cb89f-56b0-4bc6-9e22-80c0d55dc754',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  updated_by?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SendEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'recipient@example.com',
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Password Reset Request',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Plain text content of the email',
    example: 'Click the link to reset your password.',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'HTML content of the email',
    example:
      '<p>Click <a href="http://example.com/reset-password">here</a> to reset your password.</p>',
  })
  @IsString()
  html: string;
}
