import { Module } from "@nestjs/common";
import { databaseAccessModule } from 'src/utils';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [databaseAccessModule()],
    providers: [UserService],
    controllers: [UserController]
})

export class UserModule {};