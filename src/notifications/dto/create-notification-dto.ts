import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  NotificationTargetInterface,
  TargetTypes,
} from '../interfaces/notification-target.interface';
import { NotificationSeverityEnum } from '../notification-severity.enum';
import { NotificationTypeEnum } from '../notification-type.enum';
import { NotificationVisibilityEnum } from '../notification-visibility.enum';

export class createNotificationDto {
  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  object: string;

  @IsEnum(NotificationVisibilityEnum)
  visibility: NotificationVisibilityEnum.Private;

  @IsEnum(NotificationSeverityEnum)
  severity: NotificationSeverityEnum.Info;

  @Exclude({ toPlainOnly: true })
  target: NotificationTargetInterface;

  @Expose({
    name: 'target_type',
    toPlainOnly: true,
  })
  getTargetType(): TargetTypes {
    return this.target.type;
  }

  @Expose({
    name: 'target_id',
    toPlainOnly: true,
  })
  getTargetId() {
    return this.target.id;
  }
}
