import { PartialType } from '@nestjs/mapped-types';
import { LocationModel } from '../entities/location.entity';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
    id: number;
    address: string;
    city: string;
    postalCode: number;

    public static toEntity(dto: UpdateLocationDto): LocationModel{
        const loc: LocationModel = new LocationModel();
        loc.id = dto.id;
        loc.address = dto.address;
        loc.city = dto.city;
        loc.postalCode = dto.postalCode;
        return loc;
    }
}
