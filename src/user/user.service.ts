/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { isConstraint } from "src/utils";
import { LessThanOrEqual, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UNIQUE_MAIL, User } from "./entities/user.entity";
import { PasswordService } from "./password.service";



@Injectable()
export class UserService{
    
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Speciality)
        private specialityRepository: Repository<Speciality>,
        private passwordService: PasswordService
    ){}

    async dtoToUserEntity (dto: CreateUserDto | UpdateUserDto) {
        const user = new User();
        const speciality: string | undefined = dto.speciality;
        let specialityObject: Speciality | undefined = undefined;
        if (speciality) {
            const specialityFound = await this.specialityRepository.findOne(speciality);
            if (specialityFound) {
                specialityObject = specialityFound;
            } else {
                throw new NotFoundException('Speciality not found');
            }
        }
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.email = dto.email;
        user.password = dto.password ? await this.passwordService.hashPassword(dto.password) : undefined;
        user.isAdmin = false;
        user.gender = dto.gender;
        user.speciality = specialityObject;

        return user;
    }

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

    async create(createUserDto: CreateUserDto){
        const user = await this.dtoToUserEntity(createUserDto);
        try {
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
        const userEntity = await this.dtoToUserEntity(updateUserDto);
        try {
            await this.userRepository.update(id, userEntity);
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

    async delete(id: number) {
        const result = await this.userRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException()
        }
    }

    async setExpiry(id: number) {
        // Expiry is 3 days after today
        const expiry = new Date();
        expiry.setMonth(expiry.getDate() + 3);

        await this.userRepository.update(id, {
            expiryDate: expiry
        });
    }

    async deleteExpiredAccount() {
        await this.userRepository.delete({
            expiryDate: LessThanOrEqual(new Date())
        });
    }

};