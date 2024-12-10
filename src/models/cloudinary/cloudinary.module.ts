import { Module } from '@nestjs/common';
import { ImagesController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [ImagesController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
