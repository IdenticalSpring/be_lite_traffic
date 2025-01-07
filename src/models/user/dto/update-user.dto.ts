import { IsEmail, IsOptional, IsNotEmpty, IsEnum, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/user.entity';

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User phone number', example: '123456789' })
  @IsOptional()
  phone: string;

  @ApiProperty({ description: 'User address', example: '123 Main Street' })
  @IsOptional()
  address: string;

  @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'Is user active?', example: 1 })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
