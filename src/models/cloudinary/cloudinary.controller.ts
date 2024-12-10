import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ImagesController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, missing or invalid image file',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024, 
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer || file.size === 0) {
      console.error('No file uploaded or file is empty');
      throw new Error('No file uploaded or file is empty');
    }
    try {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      return {
        message: 'Image uploaded successfully',
        url: uploadedImage.secure_url,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.code === 'LIMIT_FILE_SIZE') {
        throw new BadRequestException('File size exceeds the 1MB limit');
      }
      throw new Error('Failed to upload image');
    }
  }
}
