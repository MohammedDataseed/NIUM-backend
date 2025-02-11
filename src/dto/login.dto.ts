import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'maker@dataseedtech.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'checker@123#', description: 'User password' })
  @IsString()
  password: string;
 
}
