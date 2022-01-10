import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNumber } from "class-validator";

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @ApiProperty()
    @IsNumber()
    accepted: number;
}
