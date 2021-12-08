import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Public } from "src/utils/roles/public.decorator";
import { RoleEnum } from "src/utils/roles/role.enum";
import { Role } from "src/utils/roles/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Role(RoleEnum.User)
@Controller('user')
export class UserController{

    constructor(
        private readonly userService: UserService,
    ){}

    @Public()
    @Post()
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string){
        return this.userService.update(updateUserDto,+id);
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        return this.userService.delete(+id);
    }

}