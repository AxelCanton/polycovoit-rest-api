import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { databaseAccessModule } from 'src/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [databaseAccessModule()],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
