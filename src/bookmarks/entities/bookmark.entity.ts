import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PropertyEntity } from 'src/properties/entities/property.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookmark')
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @Transform(({ value }) => value?.username)
  user: UserEntity;

  @ManyToOne(() => PropertyEntity)
  @JoinColumn({ name: 'property_id' })
  property: Partial<PropertyEntity>;

  @CreateDateColumn()
  @ApiProperty()
  created_at: string;
}
