import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LocationModule} from './location/location.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    LocationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
