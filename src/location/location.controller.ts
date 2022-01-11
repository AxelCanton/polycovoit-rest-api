import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel } from './entities/location.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleEnum } from 'src/utils/roles/role.enum';
import { Role } from 'src/utils/roles/roles.decorator';
import { PrivateLocationDto } from './dto/private-location.dto';
import { Req } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Public } from 'src/utils/roles/public.decorator';

const isNumeric = (value: string) => {
  // Valid number examples : .234, 2938, 123.293
  const isValid = new RegExp('^[+-]?([0-9]*[.])?[0-9]*').test(value);
  return isValid;
}

@ApiTags('Location')
@Role(RoleEnum.User)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiCreatedResponse({description: 'The location was successfully created.'})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  @ApiBadRequestResponse({description:"Bad parameters, location not created."})
  async create(@Body() createLocationDto: CreateLocationDto, @Req() request) {
    const user: User = request.user;
    
    const newLocation = await this.locationService.create(createLocationDto, user.id);
    return newLocation;
  }

  @Get()
  async findByCoordinates(@Query('ne_lat') ne_lat: string, @Query('ne_long') ne_long: string, @Query('sw_lat') sw_lat: string, @Query('sw_long') sw_long: string, ): Promise<PrivateLocationDto[]> {
    const isValidQueryParams = isNumeric(ne_lat) && isNumeric(ne_long) && isNumeric(sw_lat) && isNumeric(sw_long);
    if(!isValidQueryParams) {
      throw new BadRequestException('Invalid coordinates');
    }
    const neLat = parseFloat(ne_lat);
    const neLong = parseFloat(ne_long);
    const swLat = parseFloat(sw_lat);
    const swLong = parseFloat(sw_long);
    const locations = await this.locationService.findByCoordinates(neLat, neLong, swLat, swLong);

    // We don't want to expose the address and the user whom they belong to.
    const privateLocations = locations.map((location) => new PrivateLocationDto(location.id, location.postalCode, location.city, location.latitude, location.longitude, location.user.gender, location.user.speciality.specialityName));
    return privateLocations;
  }

  @Get(':id')
  @ApiOkResponse({description:"The location"})
  @ApiNotFoundResponse({description:"Location not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  async findOne(@Param('id') id: string) {
    const location: LocationModel = await this.locationService.findOne(+id);
    if (location === undefined) {
      throw new NotFoundException("Location was not found");
    }
    return location;
  }

  @Get()
  @ApiOkResponse({description:"All the locations for given user"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  @ApiNotFoundResponse({description:"User not found"})
  async findByUser(@Req() req) {
    const user: User = req.user;
    const userId = req.query.user;
    
    if(!userId || !Number.isInteger(userId)) {
      throw new BadRequestException('You need to set the user query parameter');
    }

    if(!user.isAdmin && user.id != userId) {
      throw new ForbiddenException();
    }

    const location = await this.locationService.findByUser(+userId);
    return location;
  }

  @Patch(':id')
  @ApiCreatedResponse({description:"The location has been modified"})
  @ApiNotFoundResponse({description:"Location not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOkResponse({description:"The location has been deleted"})
  @ApiNotFoundResponse({description:"Location not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
