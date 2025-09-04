import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCaruselDto } from './dto/create-carusel.dto';
import { UpdateCaruselDto } from './dto/update-carusel.dto';
import { Carusel } from 'src/core/entities/carusel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';

@Injectable()
export class CaruselService {

  constructor(
    @InjectRepository(Carusel) private readonly caruselRepository: Repository<Carusel>,
    private readonly fileService: FileService
  ) {}

  async create(createCaruselDto: CreateCaruselDto, file: Express.Multer.File | any) {
    try {
      let caruselImage;
      if(file){
        const fileName = await this.fileService.createFile(file, 'caruselImages');
        caruselImage = fileName
      }
      const carusel = this.caruselRepository.create({...createCaruselDto, url: caruselImage});
      await this.caruselRepository.save(carusel);

      return {
        statusCode: 201,
        message: 'Carusel created successfully',
        data: await this.caruselRepository.findOne({
          where: { id: carusel.id },
        }),
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating carusel: ${error.message}`,
      )
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
    try {
      const carusel = await this.caruselRepository.findOne({
        where: { id },
      })
      if(!carusel) {
        return {
          statusCode: 404,
          message: `Carusel with id ${id} not found`,
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Carusel fetched successfully',
        data: carusel
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching carusel: ${error.message}`,
      )
    }
  }

  async update(id: number, updateCaruselDto: UpdateCaruselDto, file: Express.Multer.File | any) {
    try {
      const carusel = await this.caruselRepository.findOne({
        where: { id },
      })
      if(!carusel) {
        return {
          statusCode: 404,
          message: `Carusel with id ${id} not found`,
          data: null
        }
      }
      if(carusel.url){
        await this.fileService.deleteFile(carusel.url, 'caruselImages')
      }
      let caruselImage: any;
      if(file){
        const fileName = await this.fileService.createFile(file, 'caruselImages');
        caruselImage = fileName
      }
      await this.caruselRepository.update(id, {...updateCaruselDto, url: caruselImage});
      return {
        statusCode: 200,
        message: 'Carusel updated successfully',
        data: await this.caruselRepository.findOne({
          where: { id },
        }),
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Error on updating carusel: ${error.message}`,
      )
    }
  }

  async remove(id: number) {
    try {
      const carusel = await this.caruselRepository.findOne({
        where: { id },
      })
      if(!carusel) {
        return {
          statusCode: 404,
          message: `Carusel with id ${id} not found`,
          data: null
        }
      }
      await this.fileService.deleteFile(carusel.url, 'caruselImages')
      await this.caruselRepository.remove(carusel);
      if(carusel.url){
        await this.fileService.deleteFile(carusel.url, 'caruselImages')
      }
      return {
        statusCode: 200,
        message: 'Carusel deleted successfully',
        data: null,
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on removing carusel: ${error.message}`,
      )
    }
  }
}
