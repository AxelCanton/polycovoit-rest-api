import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { LocationModel } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationModel, User])],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
