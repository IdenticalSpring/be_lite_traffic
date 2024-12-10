import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/user.entity';

export class UpdateUserDto {
  @ApiProperty({ description: 'The name of the user', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The email of the user', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  // @ApiProperty({ description: 'The phone number of the user', required: false })
  // @IsOptional()
  // @IsString()
  // phone?: string;

  // @ApiProperty({
  //   description: 'Indicates whether the user is active',
  //   required: false,
  // })
  // @IsOptional()
  // @IsBoolean()
  // isActive?: boolean;

  // @ApiProperty({
  //   description: 'The role of the user',
  //   enum: UserRole,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(UserRole)
  // role?: UserRole;

  @ApiProperty({
    description: 'The avatar of the user',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar?: string;

  // @ApiProperty({
  //   description: 'The date of birth of the user',
  //   required: false,
  // })
  // @IsOptional()
  // @IsDate()
  // dateOfBirth?: Date;
  // @ApiProperty({ description: 'The address of the user', required: false })
  // @IsOptional()
  // @IsString()
  // address?: string;
}
