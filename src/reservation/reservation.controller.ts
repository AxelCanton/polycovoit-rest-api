import { Controller, Get, Post, Body, Patch, Param, Delete, Header, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleEnum } from 'src/utils/roles/role.enum';
import { Role } from 'src/utils/roles/roles.decorator';
import { PrivateReservation } from './dto/private-reservation.dto';
import { Public } from 'src/utils/roles/public.decorator';

@ApiTags('Reservation')
@Role(RoleEnum.User)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiCreatedResponse({description:"Reservation have been created"})
  @ApiBadRequestResponse({description:"Bad parameters, reservation not created"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async create(@Body() createReservationDto: CreateReservationDto, @Req() req) {
    return (await this.reservationService.create(createReservationDto,req.user.id)).id;
  }

  @Get()
  @Public()
  @ApiOkResponse({description:"All the existing reservations"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
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
        message: reservation.message,
        accepted: reservation.accepted,
        date: reservation.date,
        receivingUser: {
          id: reservation.askingUser.id,
          gender: reservation.askingUser.gender,
          speciality: reservation.askingUser.speciality.specialityName,
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
        }
        resToReturn.push(res);
      }
    }

    return resToReturn;
  }

  @Get(':id')
  @ApiOkResponse({description:"The reservation"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async findOne(@Param('id') id: string) {
    return await this.reservationService.findOne(+id);
  }



  @Patch(':id')
  @Public()
  @ApiCreatedResponse({description:"The reservation has been modified"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async update(@Body() updateReservationDto: UpdateReservationDto, @Param('id') id: string) {
    
    return await this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOkResponse({description:"The reservation has been deleted"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async remove(@Param('id') id: string) {
    return await this.reservationService.remove(+id);
  }
}
