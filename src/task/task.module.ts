import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TasksService } from './task.service';

@Module({
  imports: [UserModule],
  providers: [TasksService],
})
export class TaskModule {}
