import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email or phone number of the user',
        example: 'johndoe@example.com',
    })
    @IsNotEmpty()
    identifier: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'password123',
    })
    @IsNotEmpty()
    password: string;
}
