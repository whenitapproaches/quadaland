import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Exclude, Transform } from 'class-transformer';

import * as bcrypt from 'bcrypt';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { BaseEntity } from 'src/_common/entities/base-entity';

@Entity('user')
export class UserEntity extends BaseEntity {
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

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  @Transform(({ value }) => value.name)
  role: RoleEntity;

  constructor(data: Partial<UserEntity> = {}) {
    super();
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
