import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty} from "class-validator";


export class CreateSpecialityDto {
    @ApiProperty()
    @IsNotEmpty()
    specialityName: string;
}
