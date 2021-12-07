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

  async create(createLocationDto: CreateLocationDto) {
    const user: User = await this.userRepository.findOne(createLocationDto.userId)
    if(user === undefined) {
      throw new NotFoundException("User not found");
    }
    const location: LocationModel = new LocationModel();
    location.address = createLocationDto.address;
    location.city = createLocationDto.city;
    location.postalCode = createLocationDto.postalCode;
    location.user = user;
    return await this.locationRepository.save(location);
  }


  async findOne(id: number) {
    return await this.locationRepository.findOne(id);
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
