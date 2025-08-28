import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from 'src/core/entities/brand.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { BrandImage } from 'src/core/entities/brand-emage.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    file: Express.Multer.File | any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let brandImage: BrandImage | null = null;

      if (file) {
        const fileName = await this.fileService.createFile(file, 'brandImages');
        brandImage = queryRunner.manager.create(BrandImage, { url: fileName });
        await queryRunner.manager.save(brandImage);
      }

      const brand = queryRunner.manager.create(Brand, {
        name: createBrandDto.name,
        description: createBrandDto.description,
        ...(brandImage ? { image: brandImage } : {}), // 🔑 fix
      });

      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();

      return {
        statusCode: 201,
        message: 'Brand created successfully',
        data: brand,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error on creating brand: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {}

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
