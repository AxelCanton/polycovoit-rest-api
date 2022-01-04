import { OmitType } from "@nestjs/swagger";
import { LocationModel } from "../entities/location.entity";

export class PrivateLocationDto extends OmitType(LocationModel, ['user', 'city'] as const) {
    constructor(id: number, postalCode: number, latitude: number, longitude: number, userGender: string) {
        super();
        this.id = id,
        this.postalCode = postalCode,
        this.latitude = latitude,
        this.longitude = longitude,
        this.userGender = userGender
    }

    userGender: string;
};
