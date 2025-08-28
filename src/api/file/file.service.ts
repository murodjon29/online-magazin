import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 } from 'uuid';
import { resolve, join, extname } from 'path';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { config } from 'src/config';

@Injectable()
export class FileService {
  private readonly base_url = config.BASE_API;

  // Fayl yaratish
  async createFile(file: Express.Multer.File | any, folder: string): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const file_name = `${file.originalname.split('.')[0]}__${v4()}${ext.toLowerCase()}`;
      const upload_path = resolve(__dirname, '..', '..', '..', '..', 'uploads', folder);

      if (!existsSync(upload_path)) {
        mkdirSync(upload_path, { recursive: true });
      }

      await new Promise<void>((resolve, reject) => {
        writeFile(join(upload_path, file_name), file.buffer, (err) => {
          if (err) reject(err);
          resolve();
        });
      });

      return `${this.base_url}/uploads/${folder}/${file_name}`;
    } catch (error) {
      throw new InternalServerErrorException(`Error on creating file: ${error}`);
    }
  }

  // Fayl o‘chirish
  async deleteFile(file_url: string, folder: string): Promise<void> {
    try {
      const prefix = `${this.base_url}/uploads/${folder}/`;
      const file = file_url.replace(prefix, '');
      const file_path = resolve(__dirname, '..', '..', '..', '..', 'uploads', folder, file);

      if (!existsSync(file_path)) {
        throw new InternalServerErrorException(`File does not exist: ${file_url}`);
      }

      await new Promise<void>((resolve, reject) => {
        unlink(file_path, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error on deleting file: ${error}`);
    }
  }

  // Fayl mavjudligini tekshirish
  async existFile(file_url: string, folder: string): Promise<boolean> {
    const prefix = `${this.base_url}/uploads/${folder}/`;
    const file = file_url.replace(prefix, '');
    const file_path = resolve(__dirname, '..', '..', '..', '..', 'uploads', folder, file);

    return existsSync(file_path);
  }
}
