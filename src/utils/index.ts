import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";

export const allEntities = [
    User
]

export function databaseAccessModule() {
    return TypeOrmModule.forFeature(allEntities);
}