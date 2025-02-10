import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';

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
}
