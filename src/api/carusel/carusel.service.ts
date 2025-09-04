import {
  Injectable,
  InternalServerErrorException,

} from '@nestjs/common';
import { CreateCaruselDto } from './dto/create-carusel.dto';
import { UpdateCaruselDto } from './dto/update-carusel.dto';
import { Carusel } from 'src/core/entities/carusel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';

@Injectable()
export class CaruselService {
  constructor(
    @InjectRepository(Carusel)
    private readonly caruselRepository: Repository<Carusel>,
    private readonly fileService: FileService,
  ) {}

  async create(dto: CreateCaruselDto, file?: Express.Multer.File) {
    try {
      let fileUrl: any
      if (file) {
        fileUrl = await this.fileService.createFile(file, 'caruselImages');
      }

      const carusel = this.caruselRepository.create({ ...dto, url: fileUrl });
      await this.caruselRepository.save(carusel);

      return {
        statusCode: 201,
        message: 'Carusel created successfully',
        data: carusel,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating carusel: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const carusels = await this.caruselRepository.find();
      return {
        statusCode: 200,
        message: 'Carusels fetched successfully',
        data: carusels,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching carusels: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    const carusel = await this.caruselRepository.findOne({ where: { id } });
    if (!carusel) {
      return { statusCode: 404, message: `Carusel with id ${id} not found`, data: null };
    }
    return {
      statusCode: 200,
      message: 'Carusel fetched successfully',
      data: carusel,
    };
  }

  async update(id: number, dto: UpdateCaruselDto, file?: Express.Multer.File) {
    try {
      const carusel = await this.caruselRepository.findOne({ where: { id } });
      if (!carusel)
        return { statusCode: 404, message: `Carusel with id ${id} not found`, data: null };

      if (file) {
        // Eski faylni o‘chirish
        if (carusel.url) {
          await this.fileService.deleteFile(carusel.url, 'caruselImages');
        }

        // Yangi faylni yaratish
        const newUrl = await this.fileService.createFile(file, 'caruselImages');
        carusel.url = newUrl;
      }

      Object.assign(carusel, dto);
      await this.caruselRepository.save(carusel);

      return {
        statusCode: 200,
        message: 'Carusel updated successfully',
        data: carusel,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on updating carusel: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const carusel = await this.caruselRepository.findOne({ where: { id } });
      if (!carusel)
        return {
          statusCode: 404,
          message: `Carusel with id ${id} not found`,
          data: null,
        };

      // Faylni o‘chirish
      if (carusel.url) {
        await this.fileService.deleteFile(carusel.url, 'caruselImages');
      }

      // DBdan yozuvni o‘chirish
      await this.caruselRepository.remove(carusel);

      return {
        statusCode: 200,
        message: 'Carusel deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on removing carusel: ${error.message}`,
      );
    }
  }
}
