import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { classToPlain } from 'class-transformer';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PusherService } from 'src/pusher/pusher.service';
import { PropertyApprovedEvent } from '../events/property-approved';
import { PropertyCreatedEvent } from '../events/property-created.event';

@Injectable()
export class PropertyListener {
  constructor(
    private readonly pusherService: PusherService,
    private readonly notificationService: NotificationsService,
  ) {}

  @OnEvent('property.created')
  async handlePropertyCreatedEvent(event: PropertyCreatedEvent) {
    const createdNotification = classToPlain(event).notification;

    const notification = await this.notificationService.create(
      createdNotification,
    );

    return this.pusherService.broadcast(
      notification,
      event.channelName,
      'property-created',
    );
  }

  @OnEvent('property.approved')
  async handlePropertyApprovedEvent(event: PropertyApprovedEvent) {
    const createdNotification = classToPlain(event).notification;

    const notification = await this.notificationService.create(
      createdNotification,
    );

    return this.pusherService.broadcast(
      notification,
      event.channelName,
      'property-approved',
    );
  }
}
