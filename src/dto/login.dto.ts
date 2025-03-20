import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'mohammed@dataseedtech.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mohammed@123#', description: 'User password' })
  @IsString()
  password: string;
 
}
