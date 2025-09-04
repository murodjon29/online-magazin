import { IsString } from "class-validator";

export class CreateCaruselDto {
    @IsString()
    title: string;
    
}
