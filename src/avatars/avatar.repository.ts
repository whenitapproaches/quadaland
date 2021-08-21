import { EntityRepository, Repository } from 'typeorm';
import { AvatarEntity } from './entities/avatar.entity';

@EntityRepository(AvatarEntity)
export class AvatarRepository extends Repository<AvatarEntity> {}
