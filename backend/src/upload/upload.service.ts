import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    // ── Cloudinary (images and raw files) ─────────────────────────────────
    const cloudName = configService.get<string>('cloudinary.cloudName');
    const apiKey = configService.get<string>('cloudinary.apiKey');
    const apiSecret = configService.get<string>('cloudinary.apiSecret');
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  // ── Image upload → Cloudinary ──────────────────────────────────────────
  async uploadImage(
    file: Express.Multer.File,
    folder = 'tunisia-car-rental',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: no result returned'));
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  // ── 3D GLB upload → Cloudinary raw upload (Supabase disabled) ───────────
  async uploadRaw(
    fileBuffer: Buffer,
    filename: string,
    folder = 'tunisia-car-rental/3d-models',
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder,
          public_id: `${filename}.glb`,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Raw upload failed: no result returned'));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      const readable = new Readable();
      readable.push(fileBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  // ── Image delete → Cloudinary ─────────────────────────────────────────
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const filenameWithExt = parts[parts.length - 1];
    const filename = filenameWithExt.split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${filename}`;
  }
}
