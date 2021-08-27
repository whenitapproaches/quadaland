import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthOptionalGuard } from 'src/auth/jwt-auth-optional.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { UsersService } from 'src/users/users.service';
import { pusherChannels } from './pusher-channels';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(
    private readonly pusherService: PusherService,
    private readonly usersService: UsersService,
  ) {}

  @Post('auth')
  @HttpCode(200)
  @FormDataRequest()
  @UseGuards(JwtAuthOptionalGuard)
  async auth(
    @Body() body,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    const { socket_id: socketId, channel_name: channelName } = body;

    if (channelName === 'public') {
      return this.pusherService.auth(socketId, channelName, {});
    }
    const payload = { role: currentRole, username: currentUsername };

    if (channelName.includes('private-user-')) {
      const username = channelName.replace('private-user-', '');

      await this.usersService.findOneOrFail(username);

      if (currentUsername !== username)
        throw new UnauthorizedException({
          message: 'channel.auth',
        });
    } else {
      if (!pusherChannels[channelName]) {
        throw new NotFoundException({
          message: 'not_found.channel',
        });
      }

      if (!pusherChannels[channelName].includes(currentRole)) {
        throw new UnauthorizedException({
          message: 'channel.auth',
        });
      }
    }

    return this.pusherService.auth(socketId, channelName, payload);
  }

  @Post('public')
  @HttpCode(200)
  @FormDataRequest()
  async public(@Body() body) {
    const { socket_id: socketId, channel_name: channelName } = body;

    return this.pusherService.auth(socketId, channelName, {});
  }
}
