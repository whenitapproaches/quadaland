import { Module } from '@nestjs/common';
import { PusherSocketManager } from './pusher-socket-manager';
import { PusherController } from './pusher.controller';
import { PusherService } from './pusher.service';

@Module({
  controllers: [PusherController],
  providers: [PusherService, PusherSocketManager],
})
export class PusherModule {}
