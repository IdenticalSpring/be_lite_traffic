import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './entity/camera.entity';
import { CreateCameraDto } from './dto/create_camera.dto';
import { UpdateCameraDto } from './dto/update_camera.dto';

@Injectable()
export class CameraService {
    constructor(
        @InjectRepository(Camera)
        private cameraRepository: Repository<Camera>,
    ) { }

    findAll(): Promise<Camera[]> {
        return this.cameraRepository.find();
    }

    findOne(id: number): Promise<Camera> {
        return this.cameraRepository.findOneBy({ id });
    }

    create(createCameraDto: CreateCameraDto): Promise<Camera> {
        const newCamera = this.cameraRepository.create(createCameraDto);
        return this.cameraRepository.save(newCamera);
    }

    async update(id: number, updateCameraDto: UpdateCameraDto): Promise<Camera> {
        await this.cameraRepository.update(id, updateCameraDto);
        return this.cameraRepository.findOneBy({ id });
    }

    remove(id: number): Promise<void> {
        return this.cameraRepository.delete(id).then(() => undefined);
    }
}
