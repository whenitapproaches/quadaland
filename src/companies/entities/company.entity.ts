import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaEntity } from 'src/media/entities/media.entity';
import { ProfileEntity } from 'src/_common/entities/profile-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('company')
export class CompanyEntity extends ProfileEntity {
  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  facebook: string;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  instagram: string;

  @Column({
    nullable: true,
  })
  @ApiPropertyOptional()
  twitter: string;

  @ManyToMany(() => MediaEntity)
  @JoinTable({
    name: 'company_media',
    joinColumn: {
      name: 'company_id',
    },
    inverseJoinColumn: {
      name: 'media_id',
    },
  })
  media: MediaEntity[];
}
