import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({
    description: "Account holder's full name",
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  account_holder_name: string;

  @ApiProperty({
    description: 'Unique bank account number',
    example: '123456789012',
  })
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiProperty({
    description: 'Name of the bank',
    example: 'State Bank of India',
  })
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @ApiProperty({
    description: 'Branch of the bank',
    example: 'MG Road Branch',
  })
  @IsNotEmpty()
  @IsString()
  bank_branch: string;

  @ApiProperty({
    description: 'IFSC code of the bank branch',
    example: 'SBIN0001234',
  })
  @IsNotEmpty()
  @IsString()
  ifsc_code: string;

  @ApiProperty({
    description: 'Indicates if the account is a beneficiary',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_beneficiary?: boolean;
}

export class UpdateBankAccountDto {
  @ApiProperty({
    description: "Account holder's full name",
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_holder_name?: string;

  @ApiProperty({
    description: 'Unique bank account number',
    example: '123456789012',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_number?: string;

  @ApiProperty({
    description: 'Name of the bank',
    example: 'State Bank of India',
    required: false,
  })
  @IsOptional()
  @IsString()
  bank_name?: string;

  @ApiProperty({
    description: 'Branch of the bank',
    example: 'MG Road Branch',
    required: false,
  })
  @IsOptional()
  @IsString()
  bank_branch?: string;

  @ApiProperty({
    description: 'IFSC code of the bank branch',
    example: 'SBIN0001234',
    required: false,
  })
  @IsOptional()
  @IsString()
  ifsc_code?: string;

  @ApiProperty({
    description: 'Indicates if the account is a beneficiary',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_beneficiary?: boolean;
}
