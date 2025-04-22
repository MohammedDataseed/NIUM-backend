import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class Createtransaction_typeDto {
  @ApiProperty({
    description: 'Name of the transaction type',
    example: 'CARD LOAD',
  })
  @IsString()
  transaction_name: string;

  @ApiProperty({
    description: 'User ID of the creator of the transaction type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the transaction type',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class Updatetransaction_typeDto {
  @ApiProperty({
    description: 'Name of the Transaction Type',
    example: 'CARD LOAD',
    required: false,
  })
  @IsString()
  @IsOptional()
  transaction_name?: string;

  @ApiProperty({
    description: 'Status of the transaction type (active/inactive)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'User ID of the last user who updated the transaction type',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class transaction_typeDto {
  @ApiProperty({
    description: 'Unique identifier of the transaction type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Name of the transaction Type',
    example: 'CARD LOAD',
  })
  transaction_name: string;

  @ApiProperty({
    description: 'Timestamp of when the transaction type was created',
    example: '2025-02-17T12:34:56Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp of when the transaction type was last updated',
    example: '2025-02-17T12:34:56Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'User ID of the creator of the transaction type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the document type',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}
