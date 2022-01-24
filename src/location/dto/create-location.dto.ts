import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";


export class CreateLocationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    postalCode: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
