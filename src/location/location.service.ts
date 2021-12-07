import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationModel)
    private locationRepository: Repository<LocationModel>,
    @InjectRepository(LocationModel)
    private userRepository: Repository<LocationModel>
){}

  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.create(createLocationDto);
  }


  findOne(id: number) {
    return this.locationRepository.findOne(id);
  }

  findByUser(idUser: number){
    return this.locationRepository.find({})
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    this.locationRepository.update(id, updateLocationDto);
  }

  remove(id: number) {
    this.locationRepository.delete(id);
  }
}
