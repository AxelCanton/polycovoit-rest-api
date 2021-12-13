import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";


export class CreateLocationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;

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
    userId: number;
}
