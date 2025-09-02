import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCatalogDto } from './create-sub-catalog.dto';

export class UpdateSubCatalogDto extends PartialType(CreateSubCatalogDto) {}
