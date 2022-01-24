/* eslint-disable prettier/prettier */
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post,  Req } from "@nestjs/common";
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
        private readonly userService: UserService
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
    @Role(RoleEnum.Admin)
    async findAll(){
        return await this.userService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({description:"The user"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async findOne(@Param('id') id: string, @Req() req){
        if (parseInt(id) !== req.user.id) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return await this.userService.findOne(+id);
    }

    @Get('/speciality/:name')
    @ApiOkResponse({description:"All the users from the speciality"})
    @ApiNotFoundResponse({description:"Speciality not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async findForSpeciality(@Param('name') name: string){
        return await this.userService.findForSpeciality(name);
    }

    @Patch('/validate/:id')
    @ApiCreatedResponse({description:"The user has been modified"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async validate(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string, @Req() req){
        if (parseInt(id) !== req.user.id) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return await this.userService.validate(+id,updateUserDto);
    }

    @Delete(':id')
    @ApiOkResponse({description:"The user has been deleted"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async delete(@Param('id') id: string, @Req() req){
        if (parseInt(id) !== req.user.id) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return await this.userService.setExpiry(+id);
    }

    @Patch('/make-admin/:id')
    //@Role(RoleEnum.Admin)
    @Public()
    @ApiCreatedResponse({description:"The user has been modified"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    async makeAdmin(@Param('id') id:string){
        return await this.userService.makeAdmin(+id)
    }
}