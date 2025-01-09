import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCameraDto {
    @ApiProperty({ description: 'Name of the camera', example: 'Camera 01' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Camera URL for live stream', example: 'http://example.com/camera01' })
    @IsString()
    @IsNotEmpty()
    cameraURL: string;

    @ApiProperty({ description: 'Image URL of the camera', example: 'http://example.com/image01.jpg' })
    @IsString()
    @IsNotEmpty()
    cameraImageURL: string;
    @ApiProperty({ description: 'Latitude of the camera', example: 10.85639487526698 })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ description: 'Longitude of the camera', example: 106.78582862937027 })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
