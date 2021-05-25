import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { createNotificationDto } from './dto/create-notification-dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async findMany(queryEntityDto, currentUsername: UserEntity['username']) {
    return await this.notificationRepository.findByQueriesWithCondition(
      queryEntityDto,
    );
  }

  async create(createNotificationDto: createNotificationDto) {
    const createdNotification = await this.notificationRepository.create(
      createNotificationDto,
    );

    return await this.notificationRepository.save(createdNotification);
  }
}
