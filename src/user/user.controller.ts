import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { Public } from "src/utils/roles/public.decorator";
import { RoleEnum } from "src/utils/roles/role.enum";
import { Role } from "src/utils/roles/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags('User')
@Role(RoleEnum.User)
@Controller('user')
export class UserController{

    constructor(
        private readonly userService: UserService,
    ){}

    @Public()
    @Post()
    @ApiCreatedResponse({description:"User have been created"})
    @ApiBadRequestResponse({description:"Bad parameters, user not created"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async create(@Body() createUserDto: CreateUserDto){
        return await this.userService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({description:"All the existing users"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async findAll(){
        return await this.userService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({description:"The user"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async findOne(@Param('id') id: string){
        return await this.userService.findOne(+id);
    }

    @Get('/speciality/:name')
    @ApiOkResponse({description:"All the users from the speciality"})
    @ApiNotFoundResponse({description:"Speciality not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async findForSpeciality(@Param('name') name: string){
        return await this.userService.findForSpeciality(name);
    }

    @Patch(':id')
    @ApiCreatedResponse({description:"The user has been modified"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string){
        return await this.userService.update(updateUserDto,+id);
    }

    @Delete(':id')
    @ApiOkResponse({description:"The user has been deleted"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async delete(@Param('id') id: string){
        return await this.userService.delete(+id);
    }

}