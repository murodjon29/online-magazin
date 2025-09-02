import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from 'src/core/entities/catalog.entity';
import { SubCatalog } from 'src/core/entities/sub-catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalog, SubCatalog])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
