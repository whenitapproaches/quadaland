import { Transform } from 'class-transformer';
import { MediaEntity } from 'src/media/entities/media.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/_common/entities/base-entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('avatar')
export class AvatarEntity extends BaseEntity {
  @OneToOne(() => MediaEntity)
  @JoinColumn({ name: 'media_id' })
  @Transform(({ value }) => value)
  media: MediaEntity;
}
