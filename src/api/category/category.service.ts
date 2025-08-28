import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from '../../core/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return {
        statusCode: 201,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating category: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.find();
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

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        return {
          statusCode: 404,
          message: `Category with id ${id} not found`,
          data: null,
        };
      }
      const updatedCategory = await this.categoryRepository.update(
        id,
        updateCategoryDto,
      );
      await this.categoryRepository.save(category);
      return {
        statusCode: 200,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on updating category: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        return {
          statusCode: 404,
          message: `Category with id ${id} not found`,
          data: null,
        };
      }
      await this.categoryRepository.delete(id);
      return {
        statusCode: 200,
        message: 'Category deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on deleting category: ${error.message}`,
      );
    }
  }
}
