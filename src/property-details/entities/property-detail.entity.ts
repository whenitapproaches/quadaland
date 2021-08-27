import { Exclude, Expose, Transform } from 'class-transformer';
import { MediaEntity } from 'src/media/entities/media.entity';
import { BaseEntity } from 'src/_common/entities/base-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('property-detail')
export class PropertyDetailEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    nullable: true,
  })
  price: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  area: number;

  @Expose({
    name: 'coordinate',
  })
  getCoordinate() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 10,
  })
  @Exclude()
  latitude: number;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 10,
  })
  @Exclude()
  longitude: number;

  @Column({
    nullable: true,
  })
  address: string;

  @Column()
  title: string;

  @Column({
    length: 5000,
  })
  description: string;

  @ManyToMany(() => MediaEntity)
  @JoinTable({
    name: 'property-detail_media',
    joinColumn: {
      name: 'property_detail_id',
    },
    inverseJoinColumn: {
      name: 'media_id',
    },
  })
  media: MediaEntity[];
}
