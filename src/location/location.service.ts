import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationModel)
    private locationRepository: Repository<LocationModel>,
    @InjectRepository(User)
    private userRepository: Repository<User>
){}

  async create(createLocationDto: CreateLocationDto, userId) {
    const user: User = await this.userRepository.findOne(userId);
    if(user === undefined) {
      throw new NotFoundException("User not found");
    }
    const location: LocationModel = new LocationModel();
    location.city = createLocationDto.city;
    location.postalCode = createLocationDto.postalCode;
    location.user = user;
    location.latitude = createLocationDto.latitude;
    location.longitude = createLocationDto.longitude;
    return await this.locationRepository.save(location);
  }


  async findOne(id: number) {
    const location = await this.locationRepository.findOne(id, { relations: ['user']}); 
    return location;
  }

  async findByCoordinates(neLat: number, neLong: number, swLat: number, swLong: number, specialities: string[]) {
    const results: LocationModel[] = await this.locationRepository
    .createQueryBuilder('location')
    .innerJoinAndSelect('location.user', 'user')
    .innerJoinAndSelect('user.speciality', 'speciality')
    .andWhere('latitude > :swLat', { swLat })
    .andWhere('latitude < :neLat', { neLat })
    .andWhere('longitude > :swLong', { swLong })
    .andWhere('longitude < :neLong', { neLong })
    .andWhere('speciality.specialityName IN (:...specialities)', { specialities })
    .getMany();
    return results;
  }

  async findByUser(idUser: number){
    const user: User = await this.userRepository.findOne(idUser);
    return await this.locationRepository.find({user: user});
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.locationRepository.update(id, updateLocationDto);
  }

  async remove(id: number) {
    await this.locationRepository.delete(id);
  }
}
