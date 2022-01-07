import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsDate } from "class-validator";

export class CreateReservationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    locationId: number;

    @ApiProperty()
    @IsNotEmpty()
    date: Date;
}
