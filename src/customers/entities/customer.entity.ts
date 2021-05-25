import { ProfileEntity } from 'src/_common/entities/profile-entity';
import { Entity } from 'typeorm';

@Entity('customer')
export class CustomerEntity extends ProfileEntity {}
