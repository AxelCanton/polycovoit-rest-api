import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationModel } from 'src/location/entities/location.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocationModel)
    private locationRepository: Repository<LocationModel>,
    private readonly mailService: MailService
  ){}

  async create(createReservationDto: CreateReservationDto, idAskingUser: number) {
    try{
      const reservation: Reservation = new Reservation();
      const location: LocationModel = await this.locationRepository.findOne(createReservationDto.locationId, {relations:["user"]});
      
      //Reservation.accepted is set to 0 when unanswered, 1 of accepted and -1 if rejected.
      
      reservation.accepted = 0;
      reservation.message = createReservationDto.message;
      reservation.askingUser = await this.userRepository.findOne(idAskingUser);
      reservation.receivingUser = location.user;
      reservation.location = location;
      reservation.date = createReservationDto.date;

      await this.mailService.sendUserDemand(location.user.email)

      return await this.reservationRepository.save(reservation);
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

  async findForUser(userId: number){
    const user = await this.userRepository.findOne(userId);

    return await this.reservationRepository.find({
      where: {receivingUser: user},
      relations: ["location","askingUser","receivingUser","askingUser.speciality", "receivingUser.speciality"]});
  }

  async findByUser(userId: number){
    const user = await this.userRepository.findOne(userId);

    return  await this.reservationRepository.find({
      where:{
        askingUser: user
      },
      relations: ["location","askingUser","receivingUser","askingUser.speciality", "receivingUser.speciality"]
    });
  }

  //Utilisé uniquement pour la validation ou non d'une reservation

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    
    try {
      const reservation = await this.reservationRepository.findOne(id, {relations: ["askingUser"]})
      await this.reservationRepository.update(id, updateReservationDto);
      await this.mailService.sendUserResponse(reservation.askingUser.email)
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
