import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CaruselService } from './carusel.service';
import { CreateCaruselDto } from './dto/create-carusel.dto';
import { UpdateCaruselDto } from './dto/update-carusel.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('carusel')
export class CaruselController {
  constructor(private readonly caruselService: CaruselService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(@Body() createCaruselDto: CreateCaruselDto, @UploadedFile() file: Express.Multer.File) {
    return this.caruselService.create(createCaruselDto, file);
  }

  @Get()
  findAll() {
    return this.caruselService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caruselService.findOne(+id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaruselDto: UpdateCaruselDto, @UploadedFile() file: Express.Multer.File) {
    return this.caruselService.update(+id, updateCaruselDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caruselService.remove(+id);
  }
}
