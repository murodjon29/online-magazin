import { Module } from '@nestjs/common';
import { SubCatalogService } from './sub-catalog.service';
import { SubCatalogController } from './sub-catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCatalog } from 'src/core/entities/sub-catalog.entity';
import { Catalog } from 'src/core/entities/catalog.entity';
import { Category } from 'src/core/entities/category.entity';

@Module({
  imports : [TypeOrmModule.forFeature([SubCatalog, Catalog, Category])],
  controllers: [SubCatalogController],
  providers: [SubCatalogService],
})
export class SubCatalogModule {}
