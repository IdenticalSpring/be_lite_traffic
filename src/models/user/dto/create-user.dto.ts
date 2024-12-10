import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/user.entity';

export class CreateUserDto {
    @IsString()
    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @IsEmail()
    @ApiProperty({ description: 'The email of the user' })
    email: string;

    @IsString()
    @ApiProperty({ description: 'The password of the user' })
    password: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The phone number of the user', required: false })
    phone?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ description: 'Indicates whether the user is active', required: false })
    isActive?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty({ description: 'The date of birth of the user', required: false })
    dateOfBirth?: Date;

    @IsOptional()
    @IsEnum(UserRole)
    @ApiProperty({ description: 'The role of the user', enum: UserRole, required: false })
    role?: UserRole;

    @ApiProperty({ description: 'The avatar of the user', type: 'string', format: 'binary', required: false })
    @IsOptional()
    avatar?: string;
    @ApiProperty({ description: 'The phone number of the user', required: false })
    @IsOptional()
    address?: string;
}
