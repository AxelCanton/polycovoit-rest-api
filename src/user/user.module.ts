import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SpecialityService } from "src/speciality/speciality.service";
import { databaseAccessModule } from 'src/utils';
import { User } from "./entities/user.entity";
import { PasswordService } from "./password.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [databaseAccessModule()],
    providers: [UserService,PasswordService, SpecialityService],
    controllers: [UserController],
    exports: [UserService, PasswordService]
})

export class UserModule {};