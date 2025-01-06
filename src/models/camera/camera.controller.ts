import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CameraService } from './camera.service';
import { Camera } from './entity/camera.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cameras')
@ApiBearerAuth('JWT')
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

    @Post()
    create(@Body() camera: Partial<Camera>): Promise<Camera> {
        return this.cameraService.create(camera);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() camera: Partial<Camera>): Promise<Camera> {
        return this.cameraService.update(id, camera);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.cameraService.remove(id);
    }
}
