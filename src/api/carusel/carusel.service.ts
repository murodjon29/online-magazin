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
      const carusel = this.caruselRepository.create(createCaruselDto);

      await this.caruselRepository.save(carusel);
      if(file){
        const fileName = await this.fileService.createFile(file, 'caruselImages');
        this.caruselRepository.create({url: fileName});
      }
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

  findAll() {
    return `This action returns all carusel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carusel`;
  }

  update(id: number, updateCaruselDto: UpdateCaruselDto, file: Express.Multer.File | any) {
    return `This action updates a #${id} carusel`;
  }

  remove(id: number) {
    return `This action removes a #${id} carusel`;
  }
}
