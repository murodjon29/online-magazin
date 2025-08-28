import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from 'src/core/entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandImage } from 'src/core/entities/brand-emage.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, BrandImage]), FileModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
