import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/user.entity';

export class UserResponseDto {
    @ApiProperty({ description: 'The unique identifier of the user' })
    id: number;

    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @ApiProperty({ description: 'The email of the user' })
    email: string;

    @ApiProperty({ description: 'The phone number of the user' })
    phone: string;

    @ApiProperty({ description: 'The avatar URL of the user' })
    avatar: string;

    @ApiProperty({ description: 'The role of the user' })
    role: UserRole;

    @ApiProperty({ description: 'The date of birth of the user' })
    dateOfBirth: Date;

    @ApiProperty({ description: 'Whether the user is active' })
    isActive: boolean;

    @ApiProperty({ description: 'The account creation date' })
    createdAt: Date;

    @ApiProperty({ description: 'The last update date of the user' })
    updatedAt: Date;
    @ApiProperty({ description: 'The last update address of the user' })
    address: string;
}
