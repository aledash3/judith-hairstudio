import type { StorageProvider } from './StorageProvider';

export class CloudinaryStorageProvider implements StorageProvider {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  }

  async save(buffer: Buffer, filename: string): Promise<string> {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new Error('Cloudinary credentials are not configured in environment variables');
    }

    const base64Data = buffer.toString('base64');
    const dataUri = `data:image/webp;base64,${base64Data}`;
    const cleanPublicId = filename.replace(/\.webp$/, '');

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret
    });

    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: cleanPublicId,
      resource_type: 'image'
    });

    return result.secure_url;
  }

  async delete(url: string): Promise<void> {
    if (!url || !url.includes('cloudinary')) return;
  }
}
