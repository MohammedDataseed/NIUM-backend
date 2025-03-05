import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean,  IsEmail,IsArray, IsUUID, IsObject,IsNotEmpty, ValidateNested  } from 'class-validator';


class AadhaarDetailsDto {
  @ApiProperty({ example: "560005" })
  @IsString()
  @IsNotEmpty()
  aadhaar_pincode: string;

  @ApiProperty({ example: "2002" })
  @IsString()
  @IsNotEmpty()
  aadhaar_yob: string;

  @ApiProperty({ example: "M" })
  @IsString()
  @IsNotEmpty()
  aadhaar_gender: string;
}

export class CustomerDetailsDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @ApiProperty({ example: "john@gmail.com" })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ example: "9912345678" })
  @IsString()
  @IsNotEmpty()
  customer_phone: string;

  @ApiProperty({ example: "ACTPAN123" })
  @IsString()
  @IsNotEmpty()
  customer_pan: string;

  @ApiProperty({ type: AadhaarDetailsDto })
  @IsObject()
  @IsNotEmpty()
  customer_aadhaar_details: AadhaarDetailsDto;
}

export class CreateOrderDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  @IsUUID()
  partner_id: string;

  @ApiProperty({ example: "BMFORDERID4321" })
  @IsString()
  order_id: string;

  @ApiProperty({ example: "1" })
  @IsString()
  transaction_type: string;

  @ApiProperty({ example: "BTQ" })
  @IsString()
  purpose_type: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isEsignRequired: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isVkycRequired: boolean;

  @ApiProperty({ type: [CustomerDetailsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  customer_details: CustomerDetailsDto[];
}
