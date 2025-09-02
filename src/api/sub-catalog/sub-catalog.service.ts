import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubCatalogDto } from './dto/create-sub-catalog.dto';
import { UpdateSubCatalogDto } from './dto/update-sub-catalog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCatalog } from 'src/core/entities/sub-catalog.entity';
import { Repository } from 'typeorm';
import { Catalog } from 'src/core/entities/catalog.entity';

@Injectable()
export class SubCatalogService {

  constructor(
    @InjectRepository(SubCatalog) 
    private subCatalogRepository: Repository<SubCatalog>,
    @InjectRepository(Catalog) 
    private catalogRepository: Repository<Catalog>,
  ) {}

  async create(createSubCatalogDto: CreateSubCatalogDto) {
    try {
      const catalog = await this.catalogRepository.findOne({where: {id: createSubCatalogDto.catalogId}});
      if(!catalog) {
        return {
          statusCode: 404,
          message: `Catalog with id ${createSubCatalogDto.catalogId} not found`,
          data: null
        }
      }
      const subCatalog = this.subCatalogRepository.create({...createSubCatalogDto, catalog: catalog});
      await this.subCatalogRepository.save(subCatalog);
      return {
        statusCode: 201,
        message: 'SubCatalog created successfully',
        data: subCatalog
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating subCatalog: ${error.message}`,
      )
    }
  }

  async findAll() {
    try {
      const subCatalogs = await this.subCatalogRepository.find({relations: ['catalog']});
      return {
        statusCode: 200,
        message: 'SubCatalogs fetched successfully',
        data: subCatalogs
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching subCatalogs: ${error.message}`,
      )
    }
  }

  async findOne(id: number) {
    try {
      const subCatalog = await this.subCatalogRepository.findOne({where: {id}, relations: ['catalog']});
      if(!subCatalog) {
        return {
          statusCode: 404,
          message: `SubCatalog with id ${id} not found`,
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'SubCatalog fetched successfully',
        data: subCatalog
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching subCatalog: ${error.message}`,
      )
    }
  }

  async update(id: number, updateSubCatalogDto: UpdateSubCatalogDto) {
    try {
      const subCatalog = await this.subCatalogRepository.findOneBy({id});  
      if(!subCatalog) {
        return {
          statusCode: 404,
          message: `SubCatalog with id ${id} not found`,
          data: null
        }
      }
      await this.subCatalogRepository.update(id, updateSubCatalogDto);
      return {
        statusCode: 200,
        message: 'SubCatalog updated successfully',
        data: await this.subCatalogRepository.findOne({where:  {id}, relations: ['catalog']})
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on updating subCatalog: ${error.message}`,
      )
    }
  }

  async remove(id: number) {
    try {
      const subCatalog = await this.subCatalogRepository.findOneBy({id});
      if(!subCatalog) {
        return {
          statusCode: 404,
          message: `SubCatalog with id ${id} not found`,
          data: null
        }
      }
      await this.subCatalogRepository.remove(subCatalog);
      return {
        statusCode: 200,
        message: 'SubCatalog deleted successfully',
        data: null
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on removing subCatalog: ${error.message}`,
      )
    }
  }
}
