import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
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
    async create(@Body() createUserDto: CreateUserDto){
        const user = await this.userService.create(createUserDto); 
        return user;
    }

    @Get()
    async findAll(){
        const users = await this.userService.findAll();
        return users;
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        const user = await this.userService.findOne(+id);
        return user;
    }

    @Patch(':id')
    async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string){
        const user = await this.userService.update(updateUserDto,+id);
        return user;
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        await this.userService.delete(+id);
    }

}