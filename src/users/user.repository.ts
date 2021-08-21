import { classToPlain } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { QueryUserEntityDto } from './dto/query-user.dto';
import { UserEntity } from './entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByQueriesWithCondition(
    queryEntity: QueryUserEntityDto,
    conditions,
    { withDeleted },
  ) {
    const query = this.createQueryBuilder('user');

    if (withDeleted) query.withDeleted();

    if (queryEntity.search)
      query.andWhere('user.username LIKE :search', {
        search: `${queryEntity.search}%`,
      });

    query
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('avatar.media', 'avatar_media');

    if (queryEntity.role)
      query.andWhere('role.name = :role', {
        role: queryEntity.role,
      });

    if (queryEntity.is_active)
      query.andWhere('user.is_active = :is_active', {
        is_active: queryEntity.is_active,
      });

    if (queryEntity.sort_by) {
      queryEntity.sort_by.forEach((sortField) => {
        const order = sortField.includes('-') ? 'DESC' : 'ASC';
        const field = sortField.replace(/[+-]/, '');
        const relationField = `user.${field}`;
        query.addOrderBy(relationField, order);
      });
    }

    query
      .take(queryEntity.per_page)
      .skip(queryEntity.per_page * (queryEntity.page - 1));

    const [result, count] = await query.getManyAndCount();

    const last_page = Math.ceil(count / queryEntity.per_page);

    return {
      last_page,
      result: classToPlain(result),
      count,
    };
  }
}
