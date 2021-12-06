import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class CreateReservationDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsBoolean()
    @IsNotEmpty()
    accepted: boolean;
}
