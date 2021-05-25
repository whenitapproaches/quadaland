import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base-entity';

export class ProfileEntity extends BaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @Transform(({ value }) => value?.username)
  user: UserEntity;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  full_name: string;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  phone: string;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  address: string;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  email: string;
}
