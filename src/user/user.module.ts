import { Module } from "@nestjs/common";
import { databaseAccessModule } from 'src/utils';
import { PasswordService } from "./password.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [databaseAccessModule()],
    providers: [UserService,PasswordService],
    controllers: [UserController]
})

export class UserModule {};