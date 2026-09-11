import fs from 'fs/promises';
import path from 'path';
import type { StorageProvider } from './StorageProvider';

export class LocalStorageProvider implements StorageProvider {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  }

  async save(buffer: Buffer, filename: string): Promise<string> {
    await fs.mkdir(this.uploadsDir, { recursive: true });
    const filePath = path.join(this.uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }

  async delete(publicPath: string): Promise<void> {
    if (!publicPath) return;

    try {
      const filename = path.basename(publicPath);
      const filePath = path.join(this.uploadsDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
