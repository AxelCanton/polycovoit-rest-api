import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config.service';
import { SpecialityModule } from './speciality/speciality.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    LocationModule,
    ReservationModule,
    AuthModule,
    ScheduleModule.forRoot(),
    SpecialityModule,
    TaskModule,
    SpecialityModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
