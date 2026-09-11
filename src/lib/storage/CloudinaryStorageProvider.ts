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

    const timestamp = Math.round(Date.now() / 1000);
    const cleanPublicId = filename.replace(/\.webp$/, '');

    const crypto = await import('crypto');
    const signatureStr = `public_id=${cleanPublicId}&timestamp=${timestamp}${this.apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', dataUri);
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('public_id', cleanPublicId);
    formData.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al subir imagen a Cloudinary: ${errorText}`);
    }

    const data = await res.json();
    return data.secure_url;
  }

  async delete(url: string): Promise<void> {
    if (!url || !url.includes('cloudinary')) return;
  }
}
