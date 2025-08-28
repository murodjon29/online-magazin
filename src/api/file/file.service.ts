import {  Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 } from 'uuid';
import { resolve, join, extname } from 'path';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { config } from 'src/config';

@Injectable()
export class FileService {
  private readonly base_url = config.BASE_API;
  async createFile(file: Express.Multer.File | any): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const file_name = `${file.originalname.split('.')[0]}__${v4()}${ext.toLowerCase()}`;
      const file_path = resolve(__dirname, '..', '..', '..', '..', 'uploads');
      if (!existsSync(file_path)) {
        mkdirSync(file_path, { recursive: true });
      }
      await new Promise<void>((resolve, reject) => {
        writeFile(join(file_path, file_name), file.buffer, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
      return `${this.base_url}/${file_name}`;
    } catch (error) {
      throw new InternalServerErrorException(`Error on creating file: ${error}`);
    }
  }

  async deleteFile(file_name: string): Promise<void> {
    try {
      const prefix = this.base_url;
      const file = file_name.replace(prefix, '');
      const file_path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'uploads',
        file,
      );
      if (!existsSync(file_path)) {
        throw new InternalServerErrorException(`File does not exist: ${file_name}`);
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

  async existFile(file_name: any) {
    const file = file_name.replace(this.base_url, '');
    const file_path = resolve(__dirname, '..', '..', '..', '..', 'uploads', file);
    if (existsSync(file_path)) {
      return true;
    } else {
      return false;
    }
  }
}
