import { ApiProperty , PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  // 🎭 User Credentials
  @ApiProperty({
    description: 'The email of the user (must be unique)',
    example: 'maker@dataseedtech.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'user@123#',
  })
  @IsString()
  password: string;

  // 📌 Role & Business Information
  @ApiProperty({
    description: 'The role ID of the user',
    example: 'e89c53de-7d2e-4a10-bf75-24a6675f3f18',
  })
  @IsUUID()
  role_id: string;

  @ApiProperty({
    description: 'The business type of the user (either cash&carry or large_enterprise)',
    example: 'large_enterprise',
    enum: ['cash&carry', 'large_enterprise'],
  })
  @IsEnum(['cash&carry', 'large_enterprise'])
  business_type: string;

  // 🏦 Financial & Branch Details
  @ApiProperty({
    description: 'The branch ID associated with the user',
    example: '7cfa494d-ea85-496d-92ec-0a35a359e556',
  })
  @IsUUID()
  branch_id: string;

  @ApiProperty({
    description: 'The bank account ID associated with the user',
    example: '671fabc3-47c0-4631-8067-e324e173038f',
  })
  @IsUUID()
  bank_account_id: string;

  @ApiProperty({
    description: 'The product ID associated with the user',
    example: 'ce496d0f-b8d4-4fb1-bc42-00b184e0da13',
  })
  @IsUUID()
  product_id: string;

  // 📄 Documents
  @ApiProperty({
    description: 'The document ID associated with the user (nullable)',
    example: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  document_id?: string;

  // 🔍 Metadata
  @ApiProperty({
    description: 'The ID of the user who created this record',
    example: 'bc7cb89f-56b0-4bc6-9e22-80c0d55dc754',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'The ID of the user who last updated this record',
    example: 'bc7cb89f-56b0-4bc6-9e22-80c0d55dc754',
  })
  @IsUUID()
  updated_by: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  @IsBoolean()
  is_active: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'updatedemail@dataseedtech.com', required: false })
  email?: string;

  @ApiProperty({ example: '333cd780-af26-42f4-b9f5-0934fcf8936f', required: false })
  role_id?: string;

  @ApiProperty({ example: 'medium_enterprise', required: false })
  business_type?: string;

  @ApiProperty({ example: '7cfa494d-ea85-496d-92ec-0a35a359e556', required: false })
  branch_id?: string;

  @ApiProperty({ example: '671fabc3-47c0-4631-8067-e324e173038f', required: false })
  bank_account_id?: string;

  @ApiProperty({ example: 'bc7cb89f-56b0-4bc6-9e22-80c0d55dc754', required: false })
  updated_by?: string;

  @ApiProperty({ example: true, required: false })
  is_active?: boolean;
}


  export class SendEmailDto {
    @ApiProperty({ description: 'Recipient email address', example: 'recipient@example.com' })
    @IsEmail()
    to: string;
  
    @ApiProperty({ description: 'Email subject', example: 'Password Reset Request' })
    @IsString()
    subject: string;
  
    @ApiProperty({ description: 'Plain text content of the email', example: 'Click the link to reset your password.' })
    @IsString()
    text: string;
  
    @ApiProperty({ description: 'HTML content of the email', example: '<p>Click <a href="http://example.com/reset-password">here</a> to reset your password.</p>' })
    @IsString()
    html: string;
  }