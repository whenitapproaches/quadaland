import { createNotificationDto } from 'src/notifications/dto/create-notification-dto';

export class PropertyCreatedEvent {
  notification: createNotificationDto;
  constructor() {
    this.notification = new createNotificationDto();
  }
}
