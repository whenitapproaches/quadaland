import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UsersModule } from 'src/users/users.module';
import { PusherSocketManager } from './pusher-socket-manager';
import { PusherController } from './pusher.controller';
import { PusherService } from './pusher.service';

@Module({
  imports: [NestjsFormDataModule, UsersModule],
  controllers: [PusherController],
  providers: [PusherService, PusherSocketManager],
  exports: [PusherService],
})
export class PusherModule {}
