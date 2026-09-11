export interface StorageProvider {
  save(buffer: Buffer, filename: string): Promise<string>;
  delete(url: string): Promise<void>;
}
