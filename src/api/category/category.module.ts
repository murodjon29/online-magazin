import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../core/entities/category.entity';
import { CategoryImage } from 'src/core/entities/category-image.entity';
import { FileModule } from '../file/file.module';
import { SubCatalog } from 'src/core/entities/sub-catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryImage, SubCatalog]), FileModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
