import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean, IsNumber } from "class-validator";

export class CreateReservationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty()
    @IsBoolean()
    @IsNumber()
    @IsNotEmpty()
    locationId: number;
}
