import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LocationModule} from './location/location.module'
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    LocationModule,
    ReservationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
