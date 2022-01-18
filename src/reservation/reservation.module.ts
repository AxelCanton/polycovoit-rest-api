import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { databaseAccessModule } from 'src/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [databaseAccessModule(), MailModule],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
