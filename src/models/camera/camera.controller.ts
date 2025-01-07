import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CameraService } from './camera.service';
import { Camera } from './entity/camera.entity';
import { CreateCameraDto } from './dto/create_camera.dto';
import { UpdateCameraDto } from './dto/update_camera.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cameras')
@ApiBearerAuth('JWT')
@Controller('cameras')
export class CameraController {
    constructor(private readonly cameraService: CameraService) { }

    @Get()
    findAll(): Promise<Camera[]> {
        return this.cameraService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Camera> {
        return this.cameraService.findOne(id);
    }

    
}
