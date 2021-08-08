import { createNotificationDto } from 'src/notifications/dto/create-notification-dto';

export class PropertyApprovedEvent {
  notification: createNotificationDto;
  channelName: string;
  constructor() {
    this.notification = new createNotificationDto();
  }
}
