import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>
  ){}

  async create(createReservationDto: CreateReservationDto) {
    try{
      return await this.reservationRepository.save(createReservationDto);
    } catch (error) {
      throw new InternalServerErrorException('Unable to create new reservation')
    }
  }

  async findAll() {
    return await this.reservationRepository.find();
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne(id);

    if(reservation){
      return reservation;
    } else {
      throw new NotFoundException(`Reservation ${id} does not exist`)
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    
    try {
      await this.reservationRepository.update(id, updateReservationDto);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Unable to update reservation')
    }
  }

  async remove(id: number) {
    const result = await this.reservationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return result;
  }
}
