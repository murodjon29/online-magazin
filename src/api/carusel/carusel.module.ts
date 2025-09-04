import { Module } from '@nestjs/common';
import { CaruselService } from './carusel.service';
import { CaruselController } from './carusel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carusel } from 'src/core/entities/carusel.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Carusel]), FileModule],
  controllers: [CaruselController],
  providers: [CaruselService],
})
export class CaruselModule {}
