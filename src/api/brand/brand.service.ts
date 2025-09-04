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

  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File | any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const brand = queryRunner.manager.create(Brand, {
        name: createBrandDto.name,
        description: createBrandDto.description,
      });

      // Agar file kelsa - image yaratamiz
      if (file) {
        const fileName = await this.fileService.createFile(file, 'brandImages');
        const brandImage = queryRunner.manager.create(BrandImage, { url: fileName });
        await queryRunner.manager.save(brandImage);

        brand.image = brandImage; // 👈 FK brands.image_id ga yoziladi
      }

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

  async findAll() {
    try {
      const brands = await this.brandRepository.find({ relations: ['image'] });
      return {
        statusCode: 200,
        message: 'Brands fetched successfully',
        data: brands,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching brands: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id },
        relations: ['image'],
      });

      if (!brand) {
        return {
          statusCode: 404,
          message: `Brand with id ${id} not found`,
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: 'Brand fetched successfully',
        data: brand,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching brand: ${error.message}`,
      );
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, file: Express.Multer.File | any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const brand = await queryRunner.manager.findOne(Brand, {
        where: { id },
        relations: ['image'],
      });

      if (!brand) {
        return {
          statusCode: 404,
          message: `Brand with id ${id} not found`,
          data: null,
        };
      }

      // Agar yangi fayl kelsa
      if (file) {
        // Eski image bo‘lsa – o‘chiramiz
        if (brand.image) {
          await this.fileService.deleteFile(brand.image.url, 'brandImages');
          await queryRunner.manager.remove(BrandImage, brand.image);
        }

        // Yangi image qo‘shamiz
        const fileName = await this.fileService.createFile(file, 'brandImages');
        const newImage = queryRunner.manager.create(BrandImage, { url: fileName });
        await queryRunner.manager.save(newImage);

        brand.image = newImage;
      }

      // Update qilinadigan fieldlar
      brand.name = updateBrandDto.name ?? brand.name;
      brand.description = updateBrandDto.description ?? brand.description;

      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Brand updated successfully',
        data: brand,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error on updating brand: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const brand = await queryRunner.manager.findOne(Brand, {
        where: { id },
        relations: ['image'],
      });

      if (!brand) {
        return {
          statusCode: 404,
          message: `Brand with id ${id} not found`,
          data: null,
        };
      }

      // Agar image bo‘lsa – faylni va DBdagi yozuvni o‘chiramiz
      if (brand.image) {
        await this.fileService.deleteFile(brand.image.url, 'brandImages');
        await queryRunner.manager.remove(BrandImage, brand.image);
      }

      await queryRunner.manager.remove(Brand, brand);
      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Brand deleted successfully',
        data: null,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error on deleting brand: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
