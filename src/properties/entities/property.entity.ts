import { Transform } from 'class-transformer';
import { CompanyEntity } from 'src/companies/entities/company.entity';
import { PropertyDetailEntity } from 'src/property-details/entities/property-detail.entity';
import { PropertySaleMethodEntity } from 'src/property-sale-methods/entities/property-sale-method.entity';
import { BaseEntity } from 'src/_common/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('property')
export class PropertyEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  slug: string;

  @Column({
    default: false,
    type: 'boolean',
  })
  approval_status: boolean;

  @ManyToOne(() => PropertySaleMethodEntity)
  @JoinColumn({ name: 'sale_method_id' })
  @Transform(({ value }) => value.name)
  sale_method: PropertySaleMethodEntity;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn({ name: 'company_id' })
  @Transform(({ value }) => value)
  company: CompanyEntity;

  @OneToOne(() => PropertyDetailEntity)
  @JoinColumn({ name: 'detail_id' })
  @Transform(({ value }) => value)
  details: PropertyDetailEntity;
}
