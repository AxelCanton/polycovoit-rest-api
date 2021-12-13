import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleEnum } from 'src/utils/roles/role.enum';
import { Role } from 'src/utils/roles/roles.decorator';

@ApiTags('Reservation')
@Role(RoleEnum.Admin)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiCreatedResponse({description:"Reservation have been created"})
  @ApiBadRequestResponse({description:"Bad parameters, reservation not created"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  create(@Body() createReservationDto: CreateReservationDto) {
    // return this.reservationService.create(createReservationDto);
  }

  @Get()
  @ApiOkResponse({description:"All the existing reservations"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({description:"The reservation"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({description:"The reservation has been modified"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOkResponse({description:"The reservation has been deleted"})
  @ApiNotFoundResponse({description:"Reservation not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
