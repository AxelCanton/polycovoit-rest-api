import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

export const allEntities = [
    User
]

export function databaseAccessModule() {
    return TypeOrmModule.forFeature(allEntities);
}

export function isConstraint(error: any, constraintName: string): boolean {
    return error && error.constraint === constraintName;
}