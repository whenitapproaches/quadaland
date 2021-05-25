import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @CreateDateColumn()
  @ApiProperty()
  created_at: string;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: string;

  @DeleteDateColumn()
  @ApiProperty()
  deleted_at: string;
}
