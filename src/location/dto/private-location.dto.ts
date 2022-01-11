import { OmitType } from "@nestjs/swagger";
import { LocationModel } from "../entities/location.entity";

export class PrivateLocationDto extends OmitType(LocationModel, ['user'] as const) {
    constructor(id: number, postalCode: number, city: string, latitude: number, longitude: number, userGender: string, speciality: string) {
        super();
        this.id = id,
        this.postalCode = postalCode,
        this.city = city,
        this.latitude = latitude,
        this.longitude = longitude,
        this.userGender = userGender,
        this.userSpeciality = speciality
    }

    userGender: string;
    userSpeciality: string;
};
