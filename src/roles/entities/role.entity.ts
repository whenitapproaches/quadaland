import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  @ApiProperty()
  name: string;
}
