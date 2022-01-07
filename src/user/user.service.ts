import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SpecialityService } from "src/speciality/speciality.service";
import { isConstraint } from "src/utils";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UNIQUE_MAIL, User } from "./entities/user.entity";
import { PasswordService } from "./password.service";

@Injectable()
export class UserService{
    
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private passwordService: PasswordService
    ){}

    async findAll(){
        return await this.userRepository.find({
            join: {
                alias: "user",
                leftJoinAndSelect:{
                    speciality: "user.speciality"
                } 
            }
        });

    }

    async findOne(id: number){
        const user = await this.userRepository.findOne(id, { relations: ['speciality', 'locations']});

        if(user){
            return user;
        } else {
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }

    async findByMail(email: string){
        const user: User = await this.userRepository.findOne({
            email: email
        },{
            join: {
                alias: "user",
                leftJoinAndSelect:{
                    speciality: "user.speciality"
                } 
            }
        });

        if(user){
            return user;
        } else {
            throw new NotFoundException(`User ${email} does not exist`);
        }
    }

    async findForSpeciality(specialityName: String){
        return await this.userRepository.find({
            where: { 
                speciality: specialityName
            },
            join: {
                alias: "user",
                leftJoinAndSelect:{
                    speciality: "user.speciality"
                } 
            }
        });
    }

    async create(createUserDto: CreateUserDto){
        try {
            const user: User = new User();
            user.firstName = createUserDto.firstName;
            user.lastName = createUserDto.lastName;
            user.email = createUserDto.email;
            user.password = await this.passwordService.hashPassword(createUserDto.password);
            user.isAdmin = false;
            user.gender = createUserDto.gender;
            user.speciality = createUserDto.speciality;
            return await this.userRepository.save(user);
        } catch (error) {
            if(isConstraint(error,UNIQUE_MAIL)){
                throw new BadRequestException('This email is already used');
            } else {
                throw new InternalServerErrorException('Unable to create new user')
            }
        }
    }

    async update(updateUserDto: UpdateUserDto, id: number){
 
        if(updateUserDto.password){
            updateUserDto.password = await this.passwordService.hashPassword(updateUserDto.password);
        }

        try {
            await this.userRepository.update(id, updateUserDto);
            const user = await this.findOne(id);
            return user;
        } catch (error) {
            if(isConstraint(error,UNIQUE_MAIL)){
                throw new BadRequestException('This email is already used');
            } else {
                throw new InternalServerErrorException('Unable to update new user')
            }
        }
    }

    async updateRefreshToken(refreshToken: string, id: number) {
        try {
            await this.userRepository.update(id, {
                refreshToken: refreshToken
            });
        } catch(error) {
            throw new InternalServerErrorException();
        }
    }

    async compareRefreshToken(newRefreshToken: string, id: number): Promise<boolean> {
        try {
            const user = await this.userRepository.findOne(id);
            return user.refreshToken === newRefreshToken;
        } catch(error) {
            throw new InternalServerErrorException();
        }
    }

    async delete(id: number){
        const result = await this.userRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException()
        }
    }

};