import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (must be one of the predefined roles)',
    example: 'maker',
    enum: ['admin', 'co-admin', 'maker', 'checker', 'maker-checker'],
  })
  @IsEnum(['admin', 'co-admin', 'maker', 'checker', 'maker-checker'])
  name: string;

  @ApiProperty({
    description: 'Status of the role (active or inactive)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    description: 'UUID of the user creating the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  created_by: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Role name (must be one of the predefined roles)',
    example: 'checker',
    enum: ['admin', 'co-admin', 'maker', 'checker', 'maker-checker'],
    required: false,
  })
  @IsEnum(['admin', 'co-admin', 'maker', 'checker', 'maker-checker'])
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Status of the role (active or inactive)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    description: 'UUID of the user updating the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  updated_by: string;
}