import { PartialType } from '@nestjs/mapped-types';
import { CreateCaruselDto } from './create-carusel.dto';

export class UpdateCaruselDto extends PartialType(CreateCaruselDto) {}
