// create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEmail, IsUUID ,IsOptional} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: String, description: 'Order ID', uniqueItems: true })
  @IsString()
  order_id: string;

  // @ApiProperty({ type: String, description: 'Transaction Type ID' })
  // @IsUUID()
  // transaction_type_id: string;

  // @ApiProperty({ type: String, description: 'Purpose Type ID' })
  // @IsUUID()
  // purpose_type_id: string;
  @ApiProperty({ type: Boolean, description: 'Indicates if e-signature is required' })
  @IsBoolean()
  is_e_sign_required: boolean;

  @ApiProperty({ type: Boolean, description: 'Indicates if V-KYC is required' })
  @IsBoolean()
  is_v_kyc_required: boolean;


  @ApiProperty({ type: String, description: 'Customer Name' })
  @IsString()
  customer_name: string;

  @ApiProperty({ type: String, description: 'Customer Email' })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ type: String, description: 'Customer Phone' })
  @IsString()
  customer_phone: string;

  @ApiProperty({ type: String, description: 'Customer PAN' })
  @IsString()
  customer_pan: string;

  @ApiProperty({ type: String, description: 'Customer Aadhaar Pincode' })
  @IsString()
  customer_aadhaar_pincode: string;

  @ApiProperty({ type: String, description: 'Customer Aadhaar Date of Birth' })
  @IsString()
  customer_aadhaar_dob: string;

  @ApiProperty({ type: String, description: 'Customer Aadhaar Year of Birth' })
  @IsString()
  customer_aadhaar_yob: string;

  @ApiProperty({ type: String, description: 'Customer Gender' })
  @IsString()
  customer_gender: string;
}

export class UpdateOrderDto {
  @ApiProperty({ type: String, description: 'Transaction Type ID', required: false })
  @IsOptional()
  @IsUUID()
  transaction_type_id?: string;

  @ApiProperty({ type: Boolean, description: 'Indicates if e-signature is required', required: false })
  @IsOptional()
  @IsBoolean()
  is_e_sign_required?: boolean;

  @ApiProperty({ type: Boolean, description: 'Indicates if V-KYC is required', required: false })
  @IsOptional()
  @IsBoolean()
  is_v_kyc_required?: boolean;

  @ApiProperty({ type: String, description: 'Purpose Type ID', required: false })
  @IsOptional()
  @IsUUID()
  purpose_type_id?: string;

  @ApiProperty({ type: String, description: 'Customer Name', required: false })
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiProperty({ type: String, description: 'Customer Email', required: false })
  @IsOptional()
  @IsEmail()
  customer_email?: string;

  @ApiProperty({ type: String, description: 'Customer Phone', required: false })
  @IsOptional()
  @IsString()
  customer_phone?: string;

  @ApiProperty({ type: String, description: 'Customer PAN', required: false })
  @IsOptional()
  @IsString()
  customer_pan?: string;

  @ApiProperty({ type: String, description: 'Customer Aadhaar Pincode', required: false })
  @IsOptional()
  @IsString()
  customer_aadhaar_pincode?: string;

  @ApiProperty({ type: String, description: 'Customer Aadhaar Year of Birth', required: false })
  @IsOptional()
  @IsString()
  customer_aadhaar_yob?: string;

  @ApiProperty({ type: String, description: 'Customer Gender', required: false })
  @IsOptional()
  @IsString()
  customer_gender?: string;
}