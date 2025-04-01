// create-order.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEmail,
  IsUUID,
  IsOptional,
  IsDateString,
  IsArray,
  IsObject,
  Matches,
  IsPhoneNumber,
  IsIn,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    description: 'Partner Order ID',
    example: 'BMFORDERID4321',
  })
  @IsNotEmpty()
  @IsString()
  partner_order_id: string;

  @ApiProperty({
    type: String,
    description: 'Transaction Type ID',
    example: 'a8712d83154b960b9d3803d30b1112cam84dhj1k',
  })
  @IsNotEmpty()
  @IsString()
  transaction_type_id: string;

  @ApiProperty({
    type: Boolean,
    description: 'Indicates if e-signature is required',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_e_sign_required: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  is_v_kyc_required: boolean;

  @ApiProperty({
    type: String,
    description: 'Purpose Type ID',
    example: '378dcac6a3a4c406cc11e112b91a99e8m84dbjsa',
  })
  @IsNotEmpty()
  @IsString()
  purpose_type_id: string;

  @ApiProperty({
    type: String,
    description: 'Customer Name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({
    type: String,
    description: 'Customer Email',
    example: 'john@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  customer_email: string;

  @ApiProperty({
    type: String,
    description: 'Customer Phone',
    example: '9912345678',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  customer_phone: string;

  @ApiProperty({
    type: String,
    description: 'Customer PAN',
    example: 'ACTPAN123',
  })
  @IsNotEmpty()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'Invalid PAN format',
  })
  customer_pan: string;

  // @ApiProperty({
  //   type: String,
  //   description: 'Created By (Partner ID)',
  //   example: '00eb04d0-646c-41d5-a69e-197b2b504f01',
  //   required: true,
  // })
  // @IsUUID()
  // created_by: string;

  // @ApiProperty({
  //   type: String,
  //   description: 'Updated By (Partner ID)',
  //   example: '00eb04d0-646c-41d5-a69e-197b2b504f01',
  //   required: true,
  // })
  // @IsUUID()
  // updated_by: string;

  // @ApiProperty({
  //   type: String,
  //   description: 'Checker ID (User ID)',
  //   example: '49592f43-c59f-4084-bf3a-79a7ba6f182e',
  //   required: true,
  // })
  // @IsUUID()
  // @IsOptional()
  // checker_id: string;

  // @ApiProperty({
  //   type: Object,
  //   description: 'Merged document details',
  //   required: false,
  //   example: {
  //     url: 'http://example.com/merged.pdf',
  //     mimeType: 'application/pdf',
  //     size: 1024,
  //   },
  // })
  // @IsOptional()
  // @IsObject()
  // merged_document?: {
  //   url: string;
  //   mimeType?: string;
  //   size?: number;
  //   createdAt?: string;
  //   documentIds?: string[];
  // };

  // @ApiProperty({
  //   type: [Object],
  //   description: 'Array of documents associated with the order',
  //   required: false,
  // })
  // @IsOptional()
  // @IsArray()
  // documents?: {
  //   purposeId: string;
  //   document_type_id: string;
  //   documentName: string;
  //   documentUrl: {
  //     url: string;
  //     mimeType?: string;
  //     size?: number;
  //     uploadedAt?: string;
  //   };
  //   status?: 'pending' | 'approved' | 'rejected';
  //   documentExpiry?: string;
  //   isDocFrontImage?: boolean;
  //   isDocBackImage?: boolean;
  //   isUploaded?: boolean;
  // }[];
}

export class UpdateOrderDto {
  @ApiProperty({ example: 'BMFORDERID432' })
  @IsString()
  @IsOptional()
  order_id?: string;
  @ApiProperty({ example: 'a8712d83154b960b9d3803d30b1112cam84dhj1k' })
  @IsString()
  @IsOptional()
  transaction_type?: string;
  @ApiProperty({ example: '378dcac6a3a4c406cc11e112b91a99e8m84dbjsa' })
  @IsString()
  @IsOptional()
  purpose_type?: string;
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  is_e_sign_required?: boolean;
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  is_v_kyc_required?: boolean;

  @ApiProperty({ example: 'john' })
  @IsString()
  @IsOptional()
  customer_name?: string;
  @ApiProperty({ example: 'joh@gmail.com' })
  @IsEmail()
  @IsOptional()
  customer_email?: string;
  @ApiProperty({ example: '9950895486' })
  @IsPhoneNumber('IN')
  @IsOptional()
  customer_phone?: string;
  @ApiProperty({ example: 'CAIPT0799K' })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
  @IsOptional()
  customer_pan?: string;
  @ApiProperty({ example: 'pending' })
  @IsString()
  @IsOptional()
  order_status?: string;

  // E-Sign

  @ApiProperty({ example: 'Pending' })
  @IsString()
  @IsOptional()
  e_sign_status?: string;
  @ApiProperty({ example: 'https://esign-link.com' })
  @IsString()
  @IsOptional()
  e_sign_link?: string;
  @ApiProperty({ example: 'active' })
  @IsString()
  @IsOptional()
  e_sign_link_status?: string;
  @ApiProperty({ example: '6ae8a7a6-55fa-457b-932f-a4ba271f8eee' })
  @IsString()
  @IsOptional()
  e_sign_link_request_id?: string;
  @ApiProperty({ example: '01JP0H1M86CDW8HA4WF7V3X7HA' })
  @IsString()
  @IsOptional()
  e_sign_link_doc_id?: string;
  @ApiProperty({ example: '2025-03-30T12:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  e_sign_link_expires?: string;
  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  e_sign_completed_by_customer?: boolean;

  @ApiProperty({ example: '2025-03-13T08:40:53.328Z' })
  @IsDateString()
  @IsOptional()
  e_sign_customer_completion_date?: string;
  @ApiProperty({ example: 'Signed successfully' })
  @IsString()
  @IsOptional()
  e_sign_doc_comments?: string;

  // V-KYC

  @ApiProperty({ example: '93849' })
  @IsString()
  @IsOptional()
  v_kyc_profile_id?: string;
  @ApiProperty({ example: '787678' })
  @IsString()
  @IsOptional()
  v_kyc_reference_id?: string;

  @ApiProperty({ example: 'Pending' })
  @IsString()
  @IsOptional()
  v_kyc_status?: string;
  @ApiProperty({ example: 'https://vkyc-link.com' })
  @IsString()
  @IsOptional()
  v_kyc_link?: string;
  @ApiProperty({ example: 'active' })
  @IsString()
  @IsOptional()
  v_kyc_link_status?: string;
  @ApiProperty({ example: '2025-03-30T12:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  v_kyc_link_expires?: string;
  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  v_kyc_completed_by_customer?: boolean;

  @ApiProperty({ example: '2025-03-13T08:40:53.328Z' })
  @IsDateString()
  @IsOptional()
  v_kyc_customer_completion_date?: string;
  @ApiProperty({ example: 'KYC verified' })
  @IsString()
  @IsOptional()
  v_kyc_comments?: string;

  // Regeneration
  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_esign_regenerated?: boolean;
  @ApiProperty({ example: { reason: 'expired' } })
  @IsOptional()
  is_esign_regenerated_details?: any;
  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_video_kyc_link_regenerated?: boolean;

  @ApiProperty({ example: { reason: 'expired' } })
  @IsOptional()
  is_video_kyc_link_regenerated_details?: any;

  // Tracking

  @ApiProperty({ example: '00eb04d0-646c-41d5-a69e-197b2b504f01' })
  @IsUUID()
  @IsOptional()
  created_by?: string;
  @ApiProperty({ example: '00eb04d0-646c-41d5-a69e-197b2b504f01' })
  @IsUUID()
  @IsOptional()
  updated_by?: string;
  @ApiProperty({ example: '49592f43-c59f-4084-bf3a-79a7ba6f182e' })
  @IsUUID()
  @IsOptional()
  checker_id?: string;

  @ApiProperty({ example: 'msddfheiuroifsnjd' })
  @IsString()
  @IsOptional()
  partner_hashed_api_key?: string;

  @ApiProperty({ example: 'uweyrfjdswiewd' })
  @IsString()
  @IsOptional()
  partner_hashed_key?: string;
}

export class UpdateCheckerDto {
  @ApiProperty({
    type: [String],
    description: 'Array of Order IDs',
    example: ['BMFORDERID432'],
  })
  @IsArray()
  @IsString({ each: true }) // ✅ Ensure each item is a string
  orderIds: string[];

  @ApiProperty({
    type: String,
    description: 'Checker ID (Hashed Key)',
    example: 'aab26dd990e49d40cf5bc80774ef7e0bm87gffio',
  })
  @IsString()
  checkerId: string;
}

export class UnassignCheckerDto {
  @ApiProperty({
    type: String,
    description: 'Order ID',
    example: 'BMFORDERID432',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    type: String,
    description: 'Checker ID (Hashed Key)',
    example: 'aab26dd990e49d40cf5bc80774ef7e0bm87gffio',
  })
  @IsString()
  checkerId: string;
}

export class GetCheckerOrdersDto {
  @ApiProperty({
    type: String,
    description: 'Checker ID (Hashed Key)',
    example: 'aab26dd990e49d40cf5bc80774ef7e0bm87gffio',
  })
  @IsString()
  checkerId: string;

  @ApiProperty({
    type: String,
    description: 'Filter orders by transaction type (all/completed)',
    example: 'all',
    required: false,
  })
  @IsOptional()
  @IsIn(['all', 'completed'], {
    message: "filter must be either 'all' or 'completed'",
  })
  transaction_type?: string;
}

export class UpdateOrderDetailsDto {
  @ApiProperty({ example: 'BMFORDERID432', description: 'Order ID' })
  @IsString()
  @IsNotEmpty()
  partner_order_id: string;

  @ApiProperty({
    example: 'aab26dd990e49d40cf5bc80774ef7e0bm87gffio',
    description: 'Checker ID (Hashed Key)',
  })
  @IsString()
  @IsNotEmpty()
  checker_id: string;

  @ApiProperty({
    example: 'INV-20240304001',
    description: 'Nium Invoice Number',
  })
  @IsString()
  @IsOptional()
  nium_invoice_number: string;

  @ApiProperty({ example: 'Doc unavailable', description: 'Checker Remarks' })
  @IsString()
  @IsOptional()
  incident_checker_comments: string;

  @ApiProperty({ example: true, description: 'Incident Status' })
  @IsBoolean()
  @IsOptional()
  incident_status: boolean;
}

export class GetOrderDetailsDto {
  @ApiProperty({
    type: String,
    description: 'Order Hash Key',
    example: 'BMFORDERID4321',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    type: String,
    description: 'Checker ID',
    example: 'aab26dd990e49d40cf5bc80774ef7e0bm87gffio',
  })
  @IsString()
  checkerId: string;
}

export class FilterOrdersDto {
  @ApiProperty({
    type: String,
    description: 'Checker ID',
    example: 'aab26dd990e49d40cf5bc80774ef7e0bm87gffio',
  })
  @IsString()
  checkerId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Transaction Type ID',
    example: 'c1df6ce6482c14031bf438801c973229m87au2un',
  })
  @ApiPropertyOptional()
  @IsString()
  transaction_type_hashed_key?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Purpose Type ID',
    example: 'e93925ccc85eabc70827bca643802572m87aut5j',
  })
  @ApiPropertyOptional()
  @IsString()
  purpose_type_hashed_key?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'From Date YYYY-MM-DD',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  from?: string; // YYYY-MM-DD format

  @ApiPropertyOptional({
    type: String,
    description: 'To Date YYYY-MM-DD',
    example: '2025-03-01',
  })
  @IsOptional()
  @IsDateString()
  to?: string; // YYYY-MM-DD format
}
