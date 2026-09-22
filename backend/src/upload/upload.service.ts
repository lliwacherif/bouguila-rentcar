import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { Readable } from 'stream';

const PLACEHOLDER = /^(your_|changeme|placeholder|xxx)/i;

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly cloudinaryReady: boolean;

  constructor(private readonly configService: ConfigService) {
    // ── Cloudinary (images and raw files) ─────────────────────────────────
    const cloudName = configService.get<string>('cloudinary.cloudName')?.trim();
    const apiKey = configService.get<string>('cloudinary.apiKey')?.trim();
    const apiSecret = configService.get<string>('cloudinary.apiSecret')?.trim();
    this.cloudinaryReady = Boolean(
      cloudName && apiKey && apiSecret
      && !PLACEHOLDER.test(cloudName)
      && !PLACEHOLDER.test(apiKey)
      && !PLACEHOLDER.test(apiSecret),
    );
    if (this.cloudinaryReady) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    } else {
      this.logger.warn('Cloudinary is not configured. Image uploads will be stored locally.');
    }
  }

  // ── Image upload → Cloudinary ──────────────────────────────────────────
  async uploadImage(
    file: Express.Multer.File,
    folder = 'tunisia-car-rental',
  ): Promise<UploadApiResponse> {
    if (!file?.buffer?.length) {
      throw new Error('Upload failed: empty file');
    }

    if (this.cloudinaryReady) {
      try {
        return await this.uploadImageToCloudinary(file, folder);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Cloudinary upload failed';
        this.logger.error(`Cloudinary image upload failed, saving locally: ${message}`);
      }
    }

    return this.saveImageLocally(file, folder);
  }

  private uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: string,
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

  private async saveImageLocally(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    const safeFolder = folder
      .split('/')
      .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, ''))
      .filter(Boolean)
      .join('/');
    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
    const rawExt = extname(file.originalname || '').toLowerCase();
    const extension = allowed.has(rawExt) ? rawExt : '.jpg';
    const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${extension}`;
    const relativeDir = safeFolder || 'tunisia-car-rental';
    const dir = join(process.cwd(), 'uploads', relativeDir);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), file.buffer);

    const publicPath = `/api/uploads/${relativeDir}/${filename}`;
    return {
      secure_url: publicPath,
      public_id: `${relativeDir}/${filename.replace(/\.[^.]+$/, '')}`,
      width: 0,
      height: 0,
      format: extension.slice(1),
    } as UploadApiResponse;
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
