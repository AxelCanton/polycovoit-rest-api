/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { isConstraint } from "src/utils";
import { LessThanOrEqual, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { LdapUserDto } from "./dto/ldap-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UNIQUE_MAIL, UNIQUE_USERNAME, User } from "./entities/user.entity";
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

    async dtoToUserEntity (dto: CreateUserDto) {
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
        user.username = dto.username;
        user.isValid = true;
        user.creationDate = new Date();

        return user;
    }

    async findAll(){
        return await this.userRepository.find({relations:['speciality','locations']});

    }

    async findOne(id: number){
        const user = await this.userRepository.findOne(id, { relations: ['speciality', 'locations']});

        if(user){
            return user;
        } else {
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }

    async findByUsername(username: string){
        const user: User = await this.userRepository.findOne({
            username: username
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
            return null;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            email
        });
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

    async createLdapUser(ldapUserDto: LdapUserDto){

        const speciality: string | undefined = ldapUserDto.speciality;
        let specialityObject: Speciality | undefined = undefined;
        if (speciality) {
            const specialityFound = await this.specialityRepository.findOne(speciality);
            if (specialityFound) {
                specialityObject = specialityFound;
            } else {
                throw new NotFoundException('Speciality not found');
            }
        }

        const user:User = new User();

        user.firstName = ldapUserDto.firstName;
        user.lastName = ldapUserDto.lastName;
        user.email = ldapUserDto.email;
        user.password = ldapUserDto.password ? await this.passwordService.hashPassword(ldapUserDto.password) : undefined;
        user.isAdmin = false;
        user.gender = "Not Defined";
        user.speciality = specialityObject;
        user.username = ldapUserDto.username;
        user.isValid = false;
        user.creationDate = new Date();
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

    async create(createUserDto: CreateUserDto){
        const user = await this.dtoToUserEntity(createUserDto);
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            if(isConstraint(error,UNIQUE_MAIL) && isConstraint(error,UNIQUE_USERNAME)){
                throw new BadRequestException('This email or username is already used');
            } else {
                throw new InternalServerErrorException('Unable to create new user')
            }
        }
    }

    async validate( id: number, updateUserDto: UpdateUserDto){
        
        const userEntity = {
            gender: updateUserDto.gender,
            isValid: true
        };
        
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

    async changePassword(id: number, password: string){
        const body = {
            password: password
        }
        try {
            await this.userRepository.update(id,body)
        } catch (error) {
            throw new InternalServerErrorException('Unable to change password')
        }
    }

    async makeAdmin(username: string){

        const user = await this.findByUsername(username)
        
        const body = {
            isAdmin: true
        }
        if(user){
            try {
                await this.userRepository.update(user.id,body)
            } catch (error) {
                throw new InternalServerErrorException('Unable to make admin')
            }
        } else {
            throw new NotFoundException('Username not found')
        }
    }

    async updateRefreshToken(refreshToken: string, id: number) {
        try {
            await this.userRepository.update(id, {
                refreshToken: refreshToken,
                lastConnectionDate: new Date()
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


    // Delete every accounts that haven't used the app for 3 years
    async deleteExpiredAccount() {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() - 3);
        await this.userRepository.delete({
            lastConnectionDate: LessThanOrEqual(expiryDate)
        });
    }

};