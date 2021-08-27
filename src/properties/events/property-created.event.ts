import { createNotificationDto } from 'src/notifications/dto/create-notification-dto';

export class PropertyCreatedEvent {
  notification: createNotificationDto;
  channelName: string;
  constructor() {
    this.notification = new createNotificationDto();
  }
}
