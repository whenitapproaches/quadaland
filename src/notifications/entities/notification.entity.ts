import { Expose } from 'class-transformer';
import { BaseEntity } from 'src/_common/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { NotificationSeverityEnum } from '../notification-severity.enum';
import { NotificationTypeEnum } from '../notification-type.enum';
import { NotificationVisibilityEnum } from '../notification-visibility.enum';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column({
    enum: NotificationTypeEnum,
  })
  type: string;

  @Column({
    nullable: true,
  })
  subject: string;

  @Column({
    nullable: true,
  })
  object: string;

  @Column({
    default: NotificationVisibilityEnum.Private,
  })
  visibility: NotificationVisibilityEnum;

  @Column({
    default: NotificationSeverityEnum.Info,
  })
  severity: NotificationSeverityEnum;

  @Column({
    nullable: true,
  })
  target_type: string;

  @Column({
    nullable: true,
  })
  target_id: string;

  @Expose()
  getTarget() {
    return {
      type: this.target_type,
      id: this.target_id,
    };
  }
}
