import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel } from './entities/location.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleEnum } from 'src/utils/roles/role.enum';
import { Role } from 'src/utils/roles/roles.decorator';

@ApiTags('Location')
@Role(RoleEnum.User)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiCreatedResponse({description: 'The location was successfully created.'})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  @ApiBadRequestResponse({description:"Bad parameters, location not created."})
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOkResponse({description:"All the locations for given user"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  @ApiNotFoundResponse({description:"User not found"})
  findByUser(@Query('user') userId: string) {
    return this.locationService.findByUser(+userId)
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
