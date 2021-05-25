import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @UseGuards(JwtAuthGuard)
  auth(@Body() body) {
    const { socket_id: socketId, channel_name: channelName } = body;

    return this.pusherService.auth(socketId, channelName);
  }
}
