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
    description: 'Partner Order ID', 
    example: 'BMFORDERID4321' 
  })
  @IsString()
  partner_order_id: string;

  @ApiProperty({ 
    type: String, 
    description: 'Transaction Type ID', 
    example: 'a8712d83154b960b9d3803d30b1112cam84dhj1k' 
  })
  @IsUUID()
  @IsOptional()
  transaction_type_id: string;

  
  @ApiProperty({ 
    type: String, 
    description: 'Purpose Type ID', 
    example: '378dcac6a3a4c406cc11e112b91a99e8m84dbjsa' 
  })
  @IsUUID()
  @IsOptional()
  purpose_type_id: string;

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
    example: true 
  })
  @IsBoolean()
  is_v_kyc_required: boolean;


  @ApiProperty({ 
    type: String, 
    description: 'Customer Name', 
    example: 'John Doe' 
  })
  @IsString()
  customer_name: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Email', 
    example: 'john@gmail.com' 
  })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer Phone', 
    example: '9912345678' 
  })
  @IsPhoneNumber('IN')
  customer_phone: string;

  @ApiProperty({ 
    type: String, 
    description: 'Customer PAN', 
    example: 'ACTPAN123' 
  })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'Invalid PAN format',
  })
  customer_pan: string;

}

export class CreateOrderDto2 {
  @ApiProperty({ 
    type: String, 
    description: 'Order ID', 
    uniqueItems: true, 
    example: 'BMFORDERID001' 
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
  @IsOptional()
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
    document_type_id: string;
    documentName: string;
    documentUrl: { url: string; mimeType?: string; size?: number; uploadedAt?: string };
    status?: "pending" | "approved" | "rejected";
    documentExpiry?: string;
    isDocFrontImage?: boolean;
    isDocBackImage?: boolean;
    isUploaded?: boolean;
  }[];
}

export class UpdateOrderDto {
  @ApiProperty({ example: 'BMFORDERID432' }) @IsString() @IsOptional() order_id?: string;
  @ApiProperty({ example: 'a8712d83154b960b9d3803d30b1112cam84dhj1k' }) @IsString() @IsOptional() transaction_type?: string;
  @ApiProperty({ example: '378dcac6a3a4c406cc11e112b91a99e8m84dbjsa' }) @IsString() @IsOptional() purpose_type?: string;
  @ApiProperty({ example: true }) @IsBoolean() @IsOptional() is_e_sign_required?: boolean;
  @ApiProperty({ example: true }) @IsBoolean() @IsOptional() is_v_kyc_required?: boolean;
  @ApiProperty({ example: 'Mohammed Tayibulla' }) @IsString() @IsOptional() customer_name?: string;
  @ApiProperty({ example: 'contact2tayib@gmail.com' }) @IsEmail() @IsOptional() customer_email?: string;
  @ApiProperty({ example: '8550895486' }) @IsPhoneNumber('IN') @IsOptional() customer_phone?: string;
  @ApiProperty({ example: 'CAIPT0727K' }) @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/) @IsOptional() customer_pan?: string;
  @ApiProperty({ example: 'pending' }) @IsString() @IsOptional() order_status?: string;

  // E-Sign
  @ApiProperty({ example: 'Pending' }) @IsString() @IsOptional() e_sign_status?: string;
  @ApiProperty({ example: 'https://esign-link.com' }) @IsString() @IsOptional() e_sign_link?: string;
  @ApiProperty({ example: 'active' }) @IsString() @IsOptional() e_sign_link_status?: string;
  @ApiProperty({ example: '2025-03-30T12:00:00.000Z' }) @IsDateString() @IsOptional() e_sign_link_expires?: string;
  @ApiProperty({ example: false }) @IsBoolean() @IsOptional() e_sign_completed_by_customer?: boolean;
  @ApiProperty({ example: '2025-03-13T08:40:53.328Z' }) @IsDateString() @IsOptional() e_sign_customer_completion_date?: string;
  @ApiProperty({ example: 'Signed successfully' }) @IsString() @IsOptional() e_sign_doc_comments?: string;

  // V-KYC
  @ApiProperty({ example: 'Pending' }) @IsString() @IsOptional() v_kyc_status?: string;
  @ApiProperty({ example: 'https://vkyc-link.com' }) @IsString() @IsOptional() v_kyc_link?: string;
  @ApiProperty({ example: 'active' }) @IsString() @IsOptional() v_kyc_link_status?: string;
  @ApiProperty({ example: '2025-03-30T12:00:00.000Z' }) @IsDateString() @IsOptional() v_kyc_link_expires?: string;
  @ApiProperty({ example: false }) @IsBoolean() @IsOptional() v_kyc_completed_by_customer?: boolean;
  @ApiProperty({ example: '2025-03-13T08:40:53.328Z' }) @IsDateString() @IsOptional() v_kyc_customer_completion_date?: string;
  @ApiProperty({ example: 'KYC verified' }) @IsString() @IsOptional() v_kyc_comments?: string;

  // Regeneration
  @ApiProperty({ example: false }) @IsBoolean() @IsOptional() is_esign_regenerated?: boolean;
  @ApiProperty({ example: { reason: 'expired' } }) @IsOptional() is_esign_regenerated_details?: any;
  @ApiProperty({ example: false }) @IsBoolean() @IsOptional() is_video_kyc_link_regenerated?: boolean;
  @ApiProperty({ example: { reason: 'expired' } }) @IsOptional() is_video_kyc_link_regenerated_details?: any;

  // Tracking
  @ApiProperty({ example: '00eb04d0-646c-41d5-a69e-197b2b504f01' }) @IsUUID() @IsOptional() created_by?: string;
  @ApiProperty({ example: '00eb04d0-646c-41d5-a69e-197b2b504f01' }) @IsUUID() @IsOptional() updated_by?: string;
  @ApiProperty({ example: '49592f43-c59f-4084-bf3a-79a7ba6f182e' }) @IsUUID() @IsOptional() checker_id?: string;
}
// export class UpdateOrderDto {
//   @ApiProperty({ type: String, description: 'Order ID', example: 'BMFORDERID432' })
//   @IsString()
//   order_id: string;

//   @ApiProperty({ type: Boolean, description: 'Indicates if e-signature is required', example: true })
//   @IsBoolean()
//   is_e_sign_required: boolean;

//   @ApiProperty({ type: Boolean, description: 'Indicates if V-KYC is required', example: false })
//   @IsBoolean()
//   is_v_kyc_required: boolean;

//   @ApiProperty({ type: String, description: 'Customer Name', example: 'Mohammed Tayibulla' })
//   @IsString()
//   customer_name: string;

//   @ApiProperty({ type: String, description: 'Customer Email', example: 'mohammed@dataseedtech.com' })
//   @IsEmail()
//   customer_email: string;

//   @ApiProperty({ type: String, description: 'Customer Phone', example: '8550895486' })
//   @IsPhoneNumber('IN')
//   customer_phone: string;

//   @ApiProperty({ type: String, description: 'Customer PAN', example: 'DAIPT0727K' })
//   @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN format' })
//   customer_pan: string;

//   @ApiProperty({ type: String, description: 'Customer Aadhaar Date of Birth', example: '2003-01-06' })
//   @IsDateString()
//   customer_aadhaar_dob: string;

//   @ApiProperty({ type: String, description: 'Order Status', example: 'pending' })
//   @IsString()
//   order_status: string;

//   @ApiProperty({ type: String, description: 'E-Sign Link', example: 'not generated' })
//   @IsString()
//   e_sign_link: string;

//   @ApiProperty({ type: String, description: 'E-Sign Status', example: 'not generated' })
//   @IsString()
//   e_sign_status: string;

//   @ApiProperty({ type: String, description: 'E-Sign Link Status', example: 'not generated' })
//   @IsString()
//   @IsOptional()
//   e_sign_link_status?: string;

//   @ApiProperty({ type: String, description: 'E-Sign Link Expiry Date', example: '2025-03-30T12:00:00.000Z' })
//   @IsDateString()
//   @IsOptional()
//   e_sign_link_expires?: string;

//   @ApiProperty({ type: Boolean, description: 'E-Sign Completed by Customer', example: false })
//   @IsBoolean()
//   e_sign_completed_by_customer: boolean;

//   @ApiProperty({ type: String, description: 'V-KYC Status', example: 'not generated' })
//   @IsString()
//   v_kyc_status: string;

//   @ApiProperty({ type: String, description: 'V-KYC Link', example: 'not generated' })
//   @IsString()
//   v_kyc_link: string;

//   @ApiProperty({ type: String, description: 'V-KYC Link Status', example: 'not generated' })
//   @IsString()
//   v_kyc_link_status: string;

//   @ApiProperty({ type: String, description: 'V-KYC Link Expiry Date', example: '2025-03-30T12:00:00.000Z' })
//   @IsDateString()
//   @IsOptional()
//   v_kyc_link_expires?: string;

//   @ApiProperty({ type: Boolean, description: 'V-KYC Completed by Customer', example: false })
//   @IsBoolean()
//   v_kyc_completed_by_customer: boolean;

//   @ApiProperty({ type: Boolean, description: 'Is E-Sign Regenerated', example: false })
//   @IsBoolean()
//   is_esign_regenerated: boolean;

//   @ApiProperty({ type: Boolean, description: 'Is Video KYC Link Regenerated', example: false })
//   @IsBoolean()
//   is_video_kyc_link_regenerated: boolean;

//   @ApiProperty({ type: String, description: 'Created By (Partner ID)', example: '00eb04d0-646c-41d5-a69e-197b2b504f01' })
//   @IsUUID()
//   created_by: string;

//   @ApiProperty({ type: String, description: 'Updated By (Partner ID)', example: '00eb04d0-646c-41d5-a69e-197b2b504f01' })
//   @IsUUID()
//   updated_by: string;

//   @ApiProperty({ type: String, description: 'Checker ID (User ID)', example: '49592f43-c59f-4084-bf3a-79a7ba6f182e' })
//   @IsUUID()
//   checker_id: string;
// }