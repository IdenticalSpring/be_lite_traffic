import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraService } from 'src/models/camera/camera.service';
import { Camera } from 'src/models/camera/entity/camera.entity';
import { CameraAdminController } from './camera.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Camera])],
    providers: [CameraService],
    controllers: [CameraAdminController],
})
export class CameraAdminModule { }
