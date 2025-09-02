import { IsNumber, IsString } from "class-validator";


export class CreateSubCatalogDto {
    @IsString()
    name: string;

    @IsNumber()
    catalogId: number
}
