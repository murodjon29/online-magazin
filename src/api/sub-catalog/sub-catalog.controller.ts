import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubCatalogService } from './sub-catalog.service';
import { CreateSubCatalogDto } from './dto/create-sub-catalog.dto';
import { UpdateSubCatalogDto } from './dto/update-sub-catalog.dto';

@Controller('sub-catalog')
export class SubCatalogController {
  constructor(private readonly subCatalogService: SubCatalogService) {}

  @Post()
  create(@Body() createSubCatalogDto: CreateSubCatalogDto) {
    return this.subCatalogService.create(createSubCatalogDto);
  }

  @Get()
  findAll() {
    return this.subCatalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCatalogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubCatalogDto: UpdateSubCatalogDto) {
    return this.subCatalogService.update(+id, updateSubCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCatalogService.remove(+id);
  }
}
