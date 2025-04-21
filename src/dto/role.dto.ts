import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (must be one of the predefined roles)',
    example: 'maker',
    enum: ['admin', 'co-admin', 'maker', 'checker', 'maker-checker'],
  })
  @IsEnum(['admin', 'co-admin', 'maker', 'checker', 'maker-checker'])
  name: string;

  @ApiPropertyOptional({
    description: 'Status of the role (active or inactive)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    description: 'ID of the user creating the role',
    example: '2',
  })
  @IsInt() // Ensure the ID is an integer (BIGINT in database)
  created_by: number;
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Unique hashed key for the role',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  hashed_key: string; // ✅ Add this

  @ApiPropertyOptional({
    description: 'Role name (must be one of the predefined roles)',
    example: 'checker',
    enum: ['admin', 'co-admin', 'maker', 'checker', 'maker-checker'],
  })
  @IsEnum(['admin', 'co-admin', 'maker', 'checker', 'maker-checker'])
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Status of the role (active or inactive)',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'UUID of the user updating the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  updated_by?: string;
}

export class DeleteRoleDto {
  @ApiProperty({
    description: 'Hashed key of the role to be deleted',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  hashed_key: string;

  @ApiProperty({
    description: 'UUID of the user deleting the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  deleted_by: string;
}

export class RoleResponseDto {
  @ApiProperty({
    description: 'Unique hashed key for the role',
    example: 'a1b2c3d4e5f6...',
  })
  hashed_key: string;

  @ApiProperty({
    description: 'Role name',
    example: 'maker',
  })
  name: string;

  @ApiProperty({
    description: 'Status of the role',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Created by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  created_by: string;

  @ApiPropertyOptional({
    description: 'Updated by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  updated_by?: string; // ✅ Now optional
}
