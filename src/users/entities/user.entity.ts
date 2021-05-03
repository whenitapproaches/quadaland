import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  is_active: boolean;

  @CreateDateColumn()
  created_at: string;

  constructor(data: Partial<UserEntity> = {}) {
    Object.assign(this, data);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!/^\$2a\$\d+\$/.test(this.password)) {
      const saltRounds = 5;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
