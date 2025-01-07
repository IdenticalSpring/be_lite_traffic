import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { CameraService } from 'src/models/camera/camera.service';
import { CreateCameraDto } from 'src/models/camera/dto/create_camera.dto';
import { UpdateCameraDto } from 'src/models/camera/dto/update_camera.dto';
import { Camera } from 'src/models/camera/entity/camera.entity';

@ApiTags('admin/Cameras')
@ApiBearerAuth('JWT')
@Controller('admin/cameras')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CameraAdminController {
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
    create(@Body() createCameraDto: CreateCameraDto): Promise<Camera> {
        return this.cameraService.create(createCameraDto);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() updateCameraDto: UpdateCameraDto,
    ): Promise<Camera> {
        return this.cameraService.update(id, updateCameraDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.cameraService.remove(id);
    }
}
