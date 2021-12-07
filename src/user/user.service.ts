import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isConstraint } from "src/utils";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UNIQUE_MAIL, User } from "./entities/user.entity";
import { PasswordService } from "./password.service";

@Injectable()
export class UserService{
    
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private passwordService: PasswordService,
    ){}

    async findAll(){
        const users = await this.userRepository.find();

        return users.map((user) => {
            const { password, ...res} = user;

            return res;
        })
    }

    async findOne(id: number){
        const user = await this.userRepository.findOne(id);

        if(user){
            const {password, ...res} = user;
            return res;
        } else {
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }

    async findByMail(mail: string){
        const user = await this.userRepository.find({
            where: { 
                mail
            },
        });

        if(user){
            return user;
        } else {
            throw new NotFoundException(`User ${mail} does not exist`);
        }
    }

    async create(createUserDto: CreateUserDto){
        try {
            createUserDto.password = await this.passwordService.hashPassword(createUserDto.password);
            const {password, ...res} = await this.userRepository.save(createUserDto);
            return res;
        } catch (error) {
            if(isConstraint(error,UNIQUE_MAIL)){
                throw new BadRequestException('This mail is already used');
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
            return await this.findOne(id);
        } catch (error) {
            if(isConstraint(error,UNIQUE_MAIL)){
                throw new BadRequestException('This mail is already used');
            } else {
                throw new InternalServerErrorException('Unable to update new user')
            }
        }
    }

    async delete(id: number){
        const result = await this.userRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException()
        }

        return result;
    }

};