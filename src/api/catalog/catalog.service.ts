import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Catalog } from 'src/core/entities/catalog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>,
  ) {}

  async create(createCatalogDto: CreateCatalogDto) {
    try {
      const catalog = this.catalogRepository.create(createCatalogDto);
      await this.catalogRepository.save(catalog);
      return {
        statusCode: 201,
        message: 'Catalog created successfully',
        data: catalog,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating catalog: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const catalogs = await this.catalogRepository.find({
        relations: ['subCatalog'], // ✅ to‘g‘rilandi
      });
      return {
        statusCode: 200,
        message: 'Catalogs fetched successfully',
        data: catalogs,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching catalogs: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const catalog = await this.catalogRepository.findOne({
        where: { id },
        relations: ['subCatalog'], // ✅ to‘g‘rilandi
      });
      if (!catalog) {
        return {
          statusCode: 404,
          message: `Catalog with id ${id} not found`,
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: 'Catalog fetched successfully',
        data: catalog,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching catalog: ${error.message}`,
      );
    }
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto) {
    try {
      const catalog = await this.catalogRepository.findOneBy({ id });
      if (!catalog) {
        return {
          statusCode: 404,
          message: `Catalog with id ${id} not found`,
          data: null,
        };
      }
      await this.catalogRepository.update(id, updateCatalogDto);
      return {
        statusCode: 200,
        message: 'Catalog updated successfully',
        data: await this.catalogRepository.findOne({
          where: { id },
          relations: ['subCatalog'], // ✅ to‘g‘rilandi
        }),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on updating catalog: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const catalog = await this.catalogRepository.findOneBy({ id });
      if (!catalog) {
        return {
          statusCode: 404,
          message: `Catalog with id ${id} not found`,
          data: null,
        };
      }
      await this.catalogRepository.remove(catalog);
      return {
        statusCode: 200,
        message: 'Catalog deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on removing catalog: ${error.message}`,
      );
    }
  }
}
