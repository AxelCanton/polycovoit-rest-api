import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { LocationModel} from "src/location/entities/location.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";

export const allEntities = [
    User,
    LocationModel,
    Reservation
]

export function databaseAccessModule() {
    return TypeOrmModule.forFeature(allEntities);
}

export function isConstraint(error: any, constraintName: string): boolean {
    return error && error.constraint === constraintName;
}