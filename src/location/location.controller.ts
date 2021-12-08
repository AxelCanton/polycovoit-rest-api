import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel } from './entities/location.entity';
import { RoleEnum } from 'src/utils/roles/role.enum';
import { Role } from 'src/utils/roles/roles.decorator';

@Role(RoleEnum.User)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findByUser(@Query('user') userId: string) {
    return this.locationService.findByUser(+userId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const location: LocationModel = await this.locationService.findOne(+id);
    if (location === undefined) {
      throw new NotFoundException("Location was not found");
    }
    return location;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
