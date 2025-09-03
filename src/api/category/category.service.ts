import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../../core/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryImage } from 'src/core/entities/category-image.entity';
import { FileService } from '../file/file.service';
import { SubCatalog } from 'src/core/entities/sub-catalog.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
    @InjectRepository(SubCatalog)
    private subCatalogRepository: Repository<SubCatalog>,
  ) {}

  // CREATE
  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subCatalog = await queryRunner.manager.findOne(SubCatalog, {
        where: { id: Number(createCategoryDto.subCatalogId) },
      });
      if (!subCatalog) {
        return {
          statusCode: 404,
          message: `SubCatalog with id ${createCategoryDto.subCatalogId} not found`,
          data: null,
        };
      }

      let categoryImage: CategoryImage | null = null;

      if (file) {
        console.log(file);
        
        const fileName = await this.fileService.createFile(file, 'categoryImages');
        categoryImage = queryRunner.manager.create(CategoryImage, { url: fileName });
        await queryRunner.manager.save(categoryImage);
      }

      const category = queryRunner.manager.create(Category, {
        ...createCategoryDto,
        subCatalog,
        ...(categoryImage ? { image: categoryImage } : {}),
      });

      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();

      return {
        statusCode: 201,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error on creating category: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // FIND ALL
  async findAll() {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['image', 'subCatalog'],
      });
      return {
        statusCode: 200,
        message: 'Categories fetched successfully',
        data: categories,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching categories: ${error.message}`,
      );
    }
  }

  // FIND ONE
  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['image', 'subCatalog'],
      });
      if (!category) {
        return {
          statusCode: 404,
          message: `Category with id ${id} not found`,
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: 'Category fetched successfully',
        data: category,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on fetching category: ${error.message}`,
      );
    }
  }

  // UPDATE
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subCatalog = await queryRunner.manager.findOne(SubCatalog, {
        where: { id: Number(updateCategoryDto.subCatalogId) },
      });
      if (!subCatalog) {
        return {
          statusCode: 404,
          message: `SubCatalog with id ${updateCategoryDto.subCatalogId} not found`,
          data: null,
        };
      }

      const category = await queryRunner.manager.findOne(Category, {
        where: { id },
        relations: ['image', 'subCatalog'],
      });
      if (!category) {
        return {
          statusCode: 404,
          message: `Category with id ${id} not found`,
          data: null,
        };
      }

      if (file) {
        if (category.image) {
          await this.fileService.deleteFile(category.image.url, 'categoryImages');
          await queryRunner.manager.remove(CategoryImage, category.image);
        }

        const fileName = await this.fileService.createFile(file, 'categoryImages');
        const newImage = queryRunner.manager.create(CategoryImage, { url: fileName });
        await queryRunner.manager.save(newImage);
        category.image = newImage;
      }

      category.name = updateCategoryDto.name ?? category.name;
      category.subCatalog = subCatalog;

      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error on updating category: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // REMOVE
  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await queryRunner.manager.findOne(Category, {
        where: { id },
        relations: ['image'],
      });

      if (!category) {
        return {
          statusCode: 404,
          message: `Category with id ${id} not found`,
          data: null,
        };
      }

      if (category.image) {
        await this.fileService.deleteFile(category.image.url, 'categoryImages');
        await queryRunner.manager.remove(CategoryImage, category.image);
      }

      await queryRunner.manager.remove(Category, category);
      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Category deleted successfully',
        data: null,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error on deleting category: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
