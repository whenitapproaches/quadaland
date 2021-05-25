import { EntityRepository, Repository } from 'typeorm';
import { PropertySaleMethodEntity } from './entities/property-sale-method.entity';

@EntityRepository(PropertySaleMethodEntity)
export class PropertySaleMethodRepository extends Repository<PropertySaleMethodEntity> {}
