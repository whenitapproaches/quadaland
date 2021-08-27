import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { classToPlain } from 'class-transformer';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PusherService } from 'src/pusher/pusher.service';
import { UserSignedUpEvent } from '../events/user-signed-up.event';

@Injectable()
export class AuthListener {
  constructor(
    private readonly pusherService: PusherService,
    private readonly notificationService: NotificationsService,
  ) {}

  @OnEvent('user.signed-up')
  async handleUserSignedUpEvent(event: UserSignedUpEvent) {
    const createdNotification = classToPlain(event).notification;

    const notification = await this.notificationService.create(
      createdNotification,
    );

    return this.pusherService.broadcast(
      notification,
      event.channelName,
      'user-signed-up',
    );
  }
}
