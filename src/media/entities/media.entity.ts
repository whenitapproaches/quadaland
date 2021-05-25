import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/_common/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MediaTypeEnum } from '../media-type.enum';
import { MediaVisibilityEnum } from '../media-visibility.enum';

@Entity('media')
export class MediaEntity extends BaseEntity {
  @Column({
    enum: MediaTypeEnum,
  })
  @ApiProperty()
  type: string;

  @Column({
    unique: true,
  })
  @ApiProperty()
  slug: string;

  @Column({
    enum: MediaVisibilityEnum,
  })
  @ApiProperty()
  visibility: MediaVisibilityEnum;

  @Column()
  @Exclude()
  @ApiProperty()
  path: string;

  @Column()
  @ApiProperty()
  file_name: string;

  @Column()
  @ApiProperty()
  file_size: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @Transform(({ value }) => value.username)
  user: UserEntity;
}
