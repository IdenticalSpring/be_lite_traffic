import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
     @IsNotEmpty()
     name: string;
 
     @ApiProperty({ description: 'User phone number', example: '123456789' })
     @IsOptional()
     phone: string;
 
     @ApiProperty({ description: 'User address', example: '123 Main Street' })
     @IsOptional()
     address: string;
 
     @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
     @IsNotEmpty()
     @IsEmail()
     email: string;
 
  
}
