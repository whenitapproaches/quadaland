import { EntityRepository, Repository } from 'typeorm';
import { PropertyDetailEntity } from './entities/property-detail.entity';

@EntityRepository(PropertyDetailEntity)
export class PropertyDetailRepository extends Repository<PropertyDetailEntity> {}
