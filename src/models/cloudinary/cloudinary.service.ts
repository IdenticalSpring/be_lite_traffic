import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload_stream(
        { folder: 'eWedding' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);  
          }
          resolve(result);
        },
      ).end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const publicId = this.getPublicIdFromUrl(imageUrl);
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    return publicIdWithExtension.split('.')[0];
  }
}
