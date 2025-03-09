// create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsBoolean, 
  IsEmail, 
  IsUUID, 
  IsOptional, 
  IsDateString,
  IsArray,
  IsObject, 
  Matches, 
  IsPhoneNumber 
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ 
    type: String, 
    description: 'Order ID', 
    uniqueItems: true, 
    example: 'BMFORDERID432' 
  })
  @IsString()
  order_id: string;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Indicates if e-signature is required', 
    example: true 
  })
  @IsBoolean()
  is_e_sign_required: boolean;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Indicates if V-KYC is required', 
    example: false 
  })
  @IsBoolean()
  is_v_kyc_required: boolean;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Name', 
    example: 'Mohammed Tayibulla' 
  })
  @IsString()
  customer_name: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Email', 
    example: 'mohammed@dataseedtech.com' 
  })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Phone', 
    example: '8550895486' 
  })
  @IsPhoneNumber('IN')
  customer_phone: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer PAN', 
    example: 'DAIPT0727K' 
  })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'Invalid PAN format',
  })
  customer_pan: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Aadhaar Pincode', 
    example: '560005' 
  })
  @Matches(/^\d{6}$/, {
    message: 'Aadhaar Pincode must be a 6-digit number',
  })
  customer_aadhaar_pincode: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Aadhaar Date of Birth', 
    example: '2003-01-06' 
  })
  @IsDateString()
  customer_aadhaar_dob: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Aadhaar Year of Birth', 
    example: '2003' 
  })
  @Matches(/^\d{4}$/, {
    message: 'Year of Birth must be a 4-digit year',
  })
  customer_aadhaar_yob: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Gender', 
    example: 'M' 
  })
  @IsString()
  customer_gender: string;

  @ApiProperty({ 
    type: String, 
    description: 'Order Status', 
    example: 'pending' 
  })
  @IsString()
  order_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'E-Sign Status', 
    example: 'not generated' 
  })
  @IsString()
  e_sign_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'E-Sign Link Status', 
    example: 'not generated' 
  })
  @IsString()
  e_sign_link_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'E-Sign Link Expiry Date', 
    example: '2025-03-30T12:00:00.000Z' 
  })
  @IsDateString()
  e_sign_link_expires: string;

  @ApiProperty({ 
    type: Boolean, 
    description: 'E-Sign Completed by Customer', 
    example: false 
  })
  @IsBoolean()
  e_sign_completed_by_customer: boolean;

  @ApiProperty({ 
    type: String, 
    description: 'V-KYC Status', 
    example: 'not generated' 
  })
  @IsString()
  v_kyc_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'V-KYC Link Status', 
    example: 'not generated' 
  })
  @IsString()
  v_kyc_link_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'V-KYC Link Expiry Date', 
    example: '2025-03-30T12:00:00.000Z' 
  })
  @IsDateString()
  v_kyc_link_expires: string;

  @ApiProperty({ 
    type: Boolean, 
    description: 'V-KYC Completed by Customer', 
    example: false 
  })
  @IsBoolean()
  v_kyc_completed_by_customer: boolean;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Is E-Sign Regenerated', 
    example: false 
  })
  @IsBoolean()
  is_esign_regenerated: boolean;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Is Video KYC Link Regenerated', 
    example: false 
  })
  @IsBoolean()
  is_video_kyc_link_regenerated: boolean;

  @ApiProperty({ 
    type: String, 
    description: 'Created By (Partner ID)', 
    example: '00eb04d0-646c-41d5-a69e-197b2b504f01', 
    required: true 
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({ 
    type: String, 
    description: 'Updated By (Partner ID)', 
    example: '00eb04d0-646c-41d5-a69e-197b2b504f01', 
    required: true 
  })
  @IsUUID()
  updated_by: string;

  @ApiProperty({ 
    type: String, 
    description: 'Checker ID (User ID)', 
    example: '49592f43-c59f-4084-bf3a-79a7ba6f182e', 
    required: true 
  })
  @IsUUID()
  checker_id: string;

  @ApiProperty({
    type: Object,
    description: "Merged document details",
    required: false,
    example: { url: "http://example.com/merged.pdf", mimeType: "application/pdf", size: 1024 },
  })
  @IsOptional()
  @IsObject()
  merged_document?: {
    url: string;
    mimeType?: string;
    size?: number;
    createdAt?: string;
    documentIds?: string[];
  };

  @ApiProperty({
    type: [Object],
    description: "Array of documents associated with the order",
    required: false,
  })
  @IsOptional()
  @IsArray()
  documents?: {
    purposeId: string;
    documentTypeId: string;
    documentName: string;
    documentUrl: { url: string; mimeType?: string; size?: number; uploadedAt?: string };
    status?: "pending" | "approved" | "rejected";
    documentExpiry?: string;
    isDocFrontImage?: boolean;
    isDocBackImage?: boolean;
    isUploaded?: boolean;
  }[];
}

export class UpdateOrderDto{
  @ApiProperty({ 
    type: String, 
    description: 'Order ID', 
    uniqueItems: true, 
    example: 'BMFORDERID432' 
  })
  @IsString()
  order_id: string;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Indicates if e-signature is required', 
    example: true 
  })
  @IsBoolean()
  is_e_sign_required: boolean;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Indicates if V-KYC is required', 
    example: false 
  })
  @IsBoolean()
  is_v_kyc_required: boolean;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Name', 
    example: 'Mohammed Tayibulla' 
  })
  @IsString()
  customer_name: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Email', 
    example: 'mohammed@dataseedtech.com' 
  })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Phone', 
    example: '8550895486' 
  })
  @IsPhoneNumber('IN')
  customer_phone: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer PAN', 
    example: 'DAIPT0727K' 
  })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'Invalid PAN format',
  })
  customer_pan: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Aadhaar Pincode', 
    example: '560005' 
  })
  @Matches(/^\d{6}$/, {
    message: 'Aadhaar Pincode must be a 6-digit number',
  })
  customer_aadhaar_pincode: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Aadhaar Date of Birth', 
    example: '2003-01-06' 
  })
  @IsDateString()
  customer_aadhaar_dob: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Aadhaar Year of Birth', 
    example: '2003' 
  })
  @Matches(/^\d{4}$/, {
    message: 'Year of Birth must be a 4-digit year',
  })
  customer_aadhaar_yob: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Gender', 
    example: 'M' 
  })
  @IsString()
  customer_gender: string;

  @ApiProperty({ 
    type: String, 
    description: 'Order Status', 
    example: 'pending' 
  })
  @IsString()
  order_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'E-Sign Status', 
    example: 'not generated' 
  })
  @IsString()
  e_sign_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'E-Sign Link Status', 
    example: 'not generated' 
  })
  @IsString()
  e_sign_link_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'E-Sign Link Expiry Date', 
    example: '2025-03-30T12:00:00.000Z' 
  })
  @IsDateString()
  e_sign_link_expires: string;

  @ApiProperty({ 
    type: Boolean, 
    description: 'E-Sign Completed by Customer', 
    example: false 
  })
  @IsBoolean()
  e_sign_completed_by_customer: boolean;

  @ApiProperty({ 
    type: String, 
    description: 'V-KYC Status', 
    example: 'not generated' 
  })
  @IsString()
  v_kyc_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'V-KYC Link Status', 
    example: 'not generated' 
  })
  @IsString()
  v_kyc_link_status: string;

  @ApiProperty({ 
    type: String, 
    description: 'V-KYC Link Expiry Date', 
    example: '2025-03-30T12:00:00.000Z' 
  })
  @IsDateString()
  v_kyc_link_expires: string;

  @ApiProperty({ 
    type: Boolean, 
    description: 'V-KYC Completed by Customer', 
    example: false 
  })
  @IsBoolean()
  v_kyc_completed_by_customer: boolean;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Is E-Sign Regenerated', 
    example: false 
  })
  @IsBoolean()
  is_esign_regenerated: boolean;

  @ApiProperty({ 
    type: Boolean, 
    description: 'Is Video KYC Link Regenerated', 
    example: false 
  })
  @IsBoolean()
  is_video_kyc_link_regenerated: boolean;

  @ApiProperty({ 
    type: String, 
    description: 'Created By (Partner ID)', 
    example: '00eb04d0-646c-41d5-a69e-197b2b504f01', 
    required: true 
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({ 
    type: String, 
    description: 'Updated By (Partner ID)', 
    example: '00eb04d0-646c-41d5-a69e-197b2b504f01', 
    required: true 
  })
  @IsUUID()
  updated_by: string;

  @ApiProperty({ 
    type: String, 
    description: 'Checker ID (User ID)', 
    example: '49592f43-c59f-4084-bf3a-79a7ba6f182e', 
    required: true 
  })
  @IsUUID()
  checker_id: string;
}

// export class UpdateOrderDto {
//   @ApiProperty({ type: String, description: 'Transaction Type ID', required: false })
//   @IsOptional()
//   @IsUUID()
//   transaction_type_id?: string;

//   @ApiProperty({ type: Boolean, description: 'Indicates if e-signature is required', required: false })
//   @IsOptional()
//   @IsBoolean()
//   is_e_sign_required?: boolean;

//   @ApiProperty({ type: Boolean, description: 'Indicates if V-KYC is required', required: false })
//   @IsOptional()
//   @IsBoolean()
//   is_v_kyc_required?: boolean;

//   @ApiProperty({ type: String, description: 'Purpose Type ID', required: false })
//   @IsOptional()
//   @IsUUID()
//   purpose_type_id?: string;

//   @ApiProperty({ type: String, description: 'Customer Name', required: false })
//   @IsOptional()
//   @IsString()
//   customer_name?: string;

//   @ApiProperty({ type: String, description: 'Customer Email', required: false })
//   @IsOptional()
//   @IsEmail()
//   customer_email?: string;

//   @ApiProperty({ type: String, description: 'Customer Phone', required: false })
//   @IsOptional()
//   @IsString()
//   customer_phone?: string;

//   @ApiProperty({ type: String, description: 'Customer PAN', required: false })
//   @IsOptional()
//   @IsString()
//   customer_pan?: string;

//   @ApiProperty({ type: String, description: 'Customer Aadhaar Pincode', required: false })
//   @IsOptional()
//   @IsString()
//   customer_aadhaar_pincode?: string;

//   @ApiProperty({ type: String, description: 'Customer Aadhaar Year of Birth', required: false })
//   @IsOptional()
//   @IsString()
//   customer_aadhaar_yob?: string;

//   @ApiProperty({ type: String, description: 'Customer Gender', required: false })
//   @IsOptional()
//   @IsString()
//   customer_gender?: string;
// }