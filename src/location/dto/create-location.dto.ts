import { IsNotEmpty, IsString, IsNumber } from "class-validator";


export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsNumber()
    @IsNotEmpty()
    postalCode: number;

}
