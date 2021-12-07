import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseAccessModule } from 'src/utils';
import { User } from "./entities/user.entity";
import { PasswordService } from "./password.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [databaseAccessModule(), TypeOrmModule.forFeature([User])],
    providers: [UserService,PasswordService],
    controllers: [UserController]
})

export class UserModule {};