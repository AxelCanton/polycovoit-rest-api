import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from 'src/utils/roles/public.decorator';
import { Role } from 'src/utils/roles/roles.decorator';
import { RoleEnum } from 'src/utils/roles/role.enum';

@ApiTags('Speciality')
@Role(RoleEnum.User)
@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post()
  @ApiCreatedResponse({description:"Speciality have been created"})
  @ApiBadRequestResponse({description:"Bad parameters, speciality not created"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.create(createSpecialityDto);
  }

  @Get()
  @ApiOkResponse({description:"All the existing specialities"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  findAll() {
    return this.specialityService.findAll();
  }

  @Get(':name')
  @ApiOkResponse({description:"The speciality"})
  @ApiNotFoundResponse({description:"Speciality not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  findOne(@Param('name') name: string) {
    return this.specialityService.findOne(name);
  }

  @Patch(':name')
  @ApiCreatedResponse({description:"The speciality has been modified"})
  @ApiNotFoundResponse({description:"Speciality not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  update(@Param('name') name: string, @Body() updateSpecialityDto: UpdateSpecialityDto) {
    return this.specialityService.update(name, updateSpecialityDto);
  }

  @Delete(':name')
  @ApiOkResponse({description:"The speciality has been deleted"})
  @ApiNotFoundResponse({description:"Speciality not found"})
  @ApiUnauthorizedResponse({description:"You are not authorized"})
  remove(@Param('name') name: string) {
    return this.specialityService.remove(name);
  }
}
