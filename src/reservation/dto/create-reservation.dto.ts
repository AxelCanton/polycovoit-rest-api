import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateReservationDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsNumber()
    @IsNotEmpty()
    locationId: number;
}
