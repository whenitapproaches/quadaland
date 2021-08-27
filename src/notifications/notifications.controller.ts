import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { QueryNotificationEntityDto } from './dto/query-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMany(
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: UserEntity['role'],
    @Query() queryEntityDto: QueryNotificationEntityDto,
  ) {
    return this.notificationsService.findMany(queryEntityDto, currentUsername);
  }
}
