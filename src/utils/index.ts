import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { LocationModel} from "src/location/entities/location.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";

export const allEntities = [
    User,
    LocationModel,
    Reservation,
    Speciality
]

export function databaseAccessModule() {
    return TypeOrmModule.forFeature(allEntities);
}

export function isConstraint(error: any, constraintName: string): boolean {
    return error && error.constraint === constraintName;
}