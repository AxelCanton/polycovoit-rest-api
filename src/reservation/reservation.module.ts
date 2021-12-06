import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { databaseAccessModule } from 'src/utils';

@Module({
  imports: [databaseAccessModule()],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
