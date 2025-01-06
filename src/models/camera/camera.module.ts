import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { Camera } from './entity/camera.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Camera])],
    providers: [CameraService],
    controllers: [CameraController],
})
export class CameraModule { }
