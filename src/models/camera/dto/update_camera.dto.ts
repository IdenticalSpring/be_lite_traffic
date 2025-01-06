import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCameraDto {
    @ApiProperty({ description: 'Name of the camera', example: 'Camera 01', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Camera URL for live stream', example: 'http://example.com/camera01', required: false })
    @IsString()
    @IsOptional()
    cameraURL?: string;

    @ApiProperty({ description: 'Image URL of the camera', example: 'http://example.com/image01.jpg', required: false })
    @IsString()
    @IsOptional()
    cameraImageURL?: string;
}
