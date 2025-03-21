import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreatePurposeDto {
  @ApiProperty({
    description: 'Name of the purpose',
    example: 'BTQ',
  })
  @IsString()
  purpose_name: string;

  @ApiProperty({
    description: 'User ID of the creator of the purpose',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the purpose',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class UpdatePurposeDto {
  @ApiProperty({
    description: 'Name of the Purpose',
    example: 'BTQ',
    required: false,
  })
  @IsString()
  @IsOptional()
  purpose_name?: string;

  @ApiProperty({
    description: 'Status of the purpose type (active/inactive)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'User ID of the last user who updated the purpose',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class PurposeDto {
  @ApiProperty({
    description: 'Unique identifier of the purpose',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Name of the purpose',
    example: 'BTQ',
  })
  purposeName: string;

  @ApiProperty({
    description: 'Timestamp of when the purpose was created',
    example: '2025-02-17T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the purpose was last updated',
    example: '2025-02-17T12:34:56Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID of the creator of the purpose',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the purpose',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}
