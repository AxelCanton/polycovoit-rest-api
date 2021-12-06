import { LocationModel } from "../entities/location.entity";

export class CreateLocationDto {
    address: string;
    city: string;
    postalCode: number;

    public static toEntity(dto: CreateLocationDto): LocationModel{
        const loc: LocationModel = new LocationModel();
        loc.address = dto.address;
        loc.city = dto.city;
        loc.postalCode = dto.postalCode;
        return loc;
    }
}
