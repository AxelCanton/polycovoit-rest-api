import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags('User')
@Controller('user')
export class UserController{

    constructor(
        private readonly userService: UserService,
    ){}

    @Post()
    @ApiCreatedResponse({description:"User have been created"})
    @ApiBadRequestResponse({description:"Bad parameters, user not created"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({description:"All the existing users"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    findAll(){
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({description:"The user"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    findOne(@Param('id') id: string){
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    @ApiCreatedResponse({description:"The user has been modified"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string){
        return this.userService.update(updateUserDto,+id);
    }

    @Delete(':id')
    @ApiOkResponse({description:"The user has been deleted"})
    @ApiNotFoundResponse({description:"User not found"})
    @ApiUnauthorizedResponse({description:"You are not authorized"})
    delete(@Param('id') id: string){
        return this.userService.delete(+id);
    }

}