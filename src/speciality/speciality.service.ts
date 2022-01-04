import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { Speciality } from './entities/speciality.entity';

@Injectable()
export class SpecialityService {

  constructor(
    @InjectRepository(Speciality)
    private specialityRepository: Repository<Speciality>
  ){}

  async create(createSpecialityDto: CreateSpecialityDto) {
    
    try{ 
      const speciality: Speciality = new Speciality();
      speciality.specialityName = createSpecialityDto.specialityName;

      return await this.specialityRepository.save(speciality)
    } catch (error) {
      throw new InternalServerErrorException('Unable to create new user')
    }
  }

  async findAll() {
    return await this.specialityRepository.find();
  }

  async findOne(name: string) {
    return await this.specialityRepository.findOne(name);
  }

  async update(name: string, updateSpecialityDto: UpdateSpecialityDto) {
    try {
      this.specialityRepository.update(name, updateSpecialityDto)
      return await this.specialityRepository.findOne(name)
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async remove(name: string) {
    const result =  await this.specialityRepository.delete(name);

    if(result.affected === 0){
      throw new NotFoundException()
  }
  }
}
