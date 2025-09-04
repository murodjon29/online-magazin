import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  create(@Body() createBrandDto: CreateBrandDto, @UploadedFile() file: Express.Multer.File | any) {
    return this.brandService.create(createBrandDto, file);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('file'))
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto, @UploadedFile() file: Express.Multer.File | any) {
    return this.brandService.update(+id, updateBrandDto, file);
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
