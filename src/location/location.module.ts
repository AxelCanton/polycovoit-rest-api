import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { databaseAccessModule } from 'src/utils';

@Module({
  imports: [databaseAccessModule()],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
