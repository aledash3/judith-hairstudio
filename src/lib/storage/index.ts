import type { StorageProvider } from './StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';
import { CloudinaryStorageProvider } from './CloudinaryStorageProvider';

let instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!instance) {
    const driver = process.env.STORAGE_DRIVER || 'local';
    if (driver === 'cloudinary') {
      instance = new CloudinaryStorageProvider();
    } else {
      instance = new LocalStorageProvider();
    }
  }
  return instance;
}

export type { StorageProvider };
export { LocalStorageProvider, CloudinaryStorageProvider };
