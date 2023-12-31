import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsEnum } from "class-validator";
import { GenderEnum } from "../enum/gender.enum";

export class CreateUserDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;


    @ApiProperty()
    @IsEnum(GenderEnum)
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    @IsNotEmpty()
    speciality: string;
}