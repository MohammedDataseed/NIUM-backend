import { ApiProperty } from '@nestjs/swagger';
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
  businessType: string;

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
  @IsUUID()
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
