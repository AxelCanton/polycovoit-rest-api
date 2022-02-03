import { Controller, Get, Post, Body, Patch, Param, Delete, Header, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleEnum } from 'src/utils/roles/role.enum';
import { Role } from 'src/utils/roles/roles.decorator';
import { PrivateReservation } from './dto/private-reservation.dto';
import { Public } from 'src/utils/roles/public.decorator';
import { LocationService } from 'src/location/location.service';

@ApiTags('Reservation')
@Role(RoleEnum.User)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService, private readonly locationService:LocationService) {}

  @Post()
  @ApiCreatedResponse({description:"Reservation have been created"})
  @ApiBadRequestResponse({description:"Bad parameters, reservation not created"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async create(@Body() createReservationDto: CreateReservationDto, @Req() req) {

    const location = await this.locationService.findOne(createReservationDto.locationId)
    if (location.user.id !== req.user.id) {
      return (await this.reservationService.create(createReservationDto,req.user.id)).id;
    } else {
      throw new UnauthorizedException()
    }
  }

  @Get()
  @Public()
  @ApiOkResponse({description:"All the existing reservations"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  @Role(RoleEnum.Admin)
  async findAll() {
    return await this.reservationService.findAll();
  }
  @Get('/for-user')
  @ApiOkResponse({description:"The reservations asked to the connected user"})
  @ApiUnauthorizedResponse({description:"You are not authorized or not connected as a user"})
  async findForUser(@Req() req){
    const reservations = await this.reservationService.findForUser(req.user.id);
    
    const resToReturn = [];

    for (const reservation of reservations){
      const res : PrivateReservation = {
        id: reservation.id,
        postalCode: reservation.location.postalCode,
        city: reservation.location.city,
        message: reservation.message,
        accepted: reservation.accepted,
        date: reservation.date,
        askingUser: {
          id: reservation.askingUser.id,
          firstName: reservation.askingUser.firstName,
          lastName: reservation.askingUser.lastName,
          email: reservation.askingUser.email,
          gender: reservation.askingUser.gender,
          speciality: reservation.askingUser.speciality.specialityName,
          isValid: reservation.askingUser.isValid
        }
      }
      resToReturn.push(res);
    }

    return resToReturn;
  }

  @Get('/by-user')
  @ApiOkResponse({description:"The reservations made by the connected user"})
  @ApiUnauthorizedResponse({description:"You are not authorized or not connected as a user"})
  async findByUser(@Req() req){
    const reservations =  await this.reservationService.findByUser(req.user.id);
    const resToReturn = [];

    for (const reservation of reservations){
      const res : PrivateReservation = {
        id: reservation.id,
        postalCode: reservation.location.postalCode,
        city: reservation.location.city,
        message: reservation.message,
        accepted: reservation.accepted,
        date: reservation.date,
        receivingUser: {
          id: reservation.askingUser.id,
          gender: reservation.askingUser.gender,
          speciality: reservation.askingUser.speciality.specialityName,
          isValid: reservation.askingUser.isValid,
        }
      }
      if (reservation.accepted !== 1){
        resToReturn.push(res);
      } else {
        res.receivingUser = {
          id: reservation.askingUser.id,
          firstName: reservation.askingUser.firstName,
          lastName: reservation.askingUser.lastName,
          email: reservation.askingUser.email,
          gender: reservation.askingUser.gender,
          speciality: reservation.askingUser.speciality.specialityName,
          isValid: reservation.askingUser.isValid
        }
        resToReturn.push(res);
      }
    }

    return resToReturn;
  }

  @Patch(':id')
  @ApiCreatedResponse({description:"The reservation has been modified"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async update(@Param('id') id: string, @Req() req) {
    await this.reservationService.fetchIfUserValid(req.user.id, +id);
    return await this.reservationService.update(+id, req.body);
  }

  @Delete(':id')
  @ApiOkResponse({description:"The reservation has been deleted"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async remove(@Param('id') id: string, @Req() req) {
    await this.reservationService.fetchIfUserValid(req.user.id, +id);
    return await this.reservationService.remove(+id);
  }

  @Get('/after/:date')
  @Role(RoleEnum.Admin)
  @ApiOkResponse({description:"The reservations made after the given date"})
  @ApiUnauthorizedResponse({description:"You are not authorized or not connected as a user"})
  async reservationAfterDate(@Param('date') date:string){
    const formatedDate = new Date(parseInt(date.split("-")[0]),parseInt(date.split("-")[1]),parseInt(date.split("-")[2]))
    const res = await this.reservationService.getReservationAfter(formatedDate)
    const toReturn = []
    for (let reservation of res) {
      toReturn.push({
        id: reservation.id,
        date: reservation.date,
        speciality: reservation.askingUser.speciality.specialityName
      })
    }

    return toReturn
  }
}
