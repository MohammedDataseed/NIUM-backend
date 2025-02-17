import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Name of the branch',
    example: 'Main Branch',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Location of the branch',
    example: 'Bengaluru',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'City where the branch is located',
    example: 'Bengaluru',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State where the branch is located',
    example: 'Karnataka',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Type of business for the branch',
    example: 'cash&carry',
    enum: ['cash&carry', 'large_enterprise'],
  })
  @IsEnum(['cash&carry', 'large_enterprise'])
  businessType: string;

  @ApiProperty({
    description: 'User ID of the creator of the branch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the branch',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class UpdateBranchDto {
  @ApiProperty({
    description: 'Name of the branch',
    example: 'Main Branch',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Location of the branch',
    example: 'Bengaluru',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'City where the branch is located',
    example: 'Bengaluru',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'State where the branch is located',
    example: 'Karnataka',
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'Type of business for the branch',
    example: 'cash&carry',
    enum: ['cash&carry', 'large_enterprise'],
    required: false,
  })
  @IsEnum(['cash&carry', 'large_enterprise'])
  @IsOptional()
  businessType?: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the branch',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}

export class BranchDto {
  @ApiProperty({
    description: 'Unique identifier of the branch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Name of the branch',
    example: 'Main Branch',
  })
  name: string;

  @ApiProperty({
    description: 'Location of the branch',
    example: 'Bengaluru',
  })
  location: string;

  @ApiProperty({
    description: 'City where the branch is located',
    example: 'Bengaluru',
  })
  city: string;

  @ApiProperty({
    description: 'State where the branch is located',
    example: 'Karnataka',
  })
  state: string;

  @ApiProperty({
    description: 'Type of business for the branch',
    example: 'cash&carry',
    enum: ['cash&carry', 'large_enterprise'],
  })
  businessType: string;

  @ApiProperty({
    description: 'Timestamp of when the branch was created',
    example: '2025-02-17T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the branch was last updated',
    example: '2025-02-17T12:34:56Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID of the creator of the branch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last user who updated the branch',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  updated_by: string;
}
