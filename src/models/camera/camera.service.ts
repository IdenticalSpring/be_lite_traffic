import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './entity/camera.entity';


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

    create(camera: Partial<Camera>): Promise<Camera> {
        const newCamera = this.cameraRepository.create(camera);
        return this.cameraRepository.save(newCamera);
    }

    async update(id: number, camera: Partial<Camera>): Promise<Camera> {
        await this.cameraRepository.update(id, camera);
        return this.cameraRepository.findOneBy({ id });
    }

    remove(id: number): Promise<void> {
        return this.cameraRepository.delete(id).then(() => undefined);
    }
}
