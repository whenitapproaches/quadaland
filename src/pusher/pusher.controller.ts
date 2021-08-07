import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @UseGuards(JwtAuthGuard)
  auth(
    @Body() body,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    const { socket_id: socketId, channel_name: channelName } = body;

    const payload = { role: currentRole, username: currentUsername };

    return this.pusherService.auth(socketId, channelName, payload);
  }
}
