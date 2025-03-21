//ekyc-request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ValidateIf,
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EsignFieldsDto {
  @ApiProperty({ example: {} })
  esign_fields: Record<string, unknown>;
}

class EsignFileDetailsDto {
  @ApiProperty({ example: 'SWR1iH' })
  esign_profile_id: string;

  @ApiProperty({ example: 'John' })
  file_name: string;

  @ValidateIf((o) => !o.order_id) // esign_file is required only if order_id is missing
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'base64_file starting with JVBERi0xL' })
  esign_file?: string;

  @ApiProperty({ type: EsignFieldsDto })
  esign_fields: EsignFieldsDto;

  @ApiProperty({ example: [], type: [String] })
  esign_additional_files: string[];

  @ApiProperty({ example: false })
  esign_allow_fill: boolean;

  @ApiPropertyOptional({ example: 'ORDER123' }) // Order ID is optional
  @IsOptional()
  @IsString()
  order_id?: string;
}

class EsignStampDetailsDto {
  @ApiProperty({ example: '' })
  esign_stamp_series: string;

  @ApiProperty({ example: '' })
  esign_series_group: string;

  @ApiProperty({ example: '' })
  esign_stamp_value: string;
}

class AadhaarEsignVerificationDto {
  @ApiProperty({ example: '' })
  @IsOptional()
  aadhaar_pincode: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  aadhaar_yob: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  aadhaar_gender: string;
}

class EsignInviteeDto {
  @ApiProperty({ example: 'John' })
  esigner_name: string;

  @ApiProperty({ example: 'john@gmail.com' })
  esigner_email: string;

  @ApiProperty({ example: '8123456789' })
  esigner_phone: string;

  @ApiProperty({ type: AadhaarEsignVerificationDto })
  aadhaar_esign_verification: AadhaarEsignVerificationDto;
}

class EkycDataDto {
  @ApiProperty({ example: 'PDF' })
  flow_type: string;

  @ApiProperty({ example: 'NN6qehC9HTfwneEZJv' })
  user_key: string;

  @ApiProperty({ example: false })
  verify_aadhaar_details: boolean;

  @ApiProperty({ type: EsignFileDetailsDto })
  esign_file_details: EsignFileDetailsDto;

  @ApiProperty({ type: EsignStampDetailsDto })
  esign_stamp_details: EsignStampDetailsDto;

  @ApiProperty({ type: [EsignInviteeDto] })
  esign_invitees: EsignInviteeDto[];
}

export class EkycRequestDto {
  @ApiProperty({ example: '234' })
  task_id: string;

  @ApiProperty({ example: '1234' })
  group_id: string;

  @ApiProperty({ example: 'ORDER123' })
  order_id: string;

  @ApiProperty({ type: EkycDataDto })
  data: EkycDataDto;
}

export class EkycRetrieveDataDto {
  @ApiProperty({
    example: 'UghN6qehC9HTfwneEZJv',
    description: 'User key for authentication',
  })
  @IsString()
  @IsNotEmpty()
  user_key: string;

  @ApiProperty({
    example: 'MMWgP',
    description:
      'eSign document ID (optional, fetched dynamically if not provided)',
  })
  @IsString()
  @IsOptional()
  esign_doc_id?: string;
}

export class EkycRetrieveRequestDto {
  @ApiProperty({
    example: 'JOHN1',
    description: 'Task ID for the e-KYC request',
  })
  @IsString()
  @IsNotEmpty()
  task_id: string;

  @ApiProperty({
    example: '1234',
    description: 'Group ID associated with the e-KYC request',
  })
  @IsString()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    example: {
      user_key: 'N0N0MwneEZJv',
      esign_doc_id: '01J4673Y',
    },
    description: 'Additional data for the request',
  })
  @ValidateNested()
  @Type(() => EkycRetrieveDataDto)
  @IsNotEmpty()
  data: EkycRetrieveDataDto;
}
