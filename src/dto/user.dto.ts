import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user (must be unique)',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The business type of the user (either cash&carry or large_enterprise)',
    example: 'cash&carry',
    enum: ['cash&carry', 'large_enterprise'],
  })
  @IsEnum(['cash&carry', 'large_enterprise'])
  businessType: string;

  // Add other fields as required
  // @ApiProperty() annotations can be added here for optional or required fields
}
