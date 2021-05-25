import { classToPlain } from 'class-transformer';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { QueryMediaEntityDto } from './dto/query-media.dto';
import { MediaEntity } from './entities/media.entity';

@EntityRepository(MediaEntity)
export class MediaRepository extends Repository<MediaEntity> {
  async getRemainingStorageByUsername(username: UserEntity['username']) {
    const query = this.createQueryBuilder('media');
    query.leftJoinAndSelect('media.user', 'user');

    query.andWhere('user.username = :username', {
      username: username,
    });

    query.select('media.file_size');

    return (await query.getMany()).reduce(
      (totalSize, medium) => totalSize + medium.file_size,
      0,
    );
  }

  async findByQueriesWithCondition(
    queryEntity: QueryMediaEntityDto,
    conditions,
  ) {
    const query = this.createQueryBuilder('media');

    query.leftJoinAndSelect('media.user', 'user');

    if (
      queryEntity.username &&
      queryEntity.username === conditions.currentUsername &&
      [RoleEnum.Company].includes(conditions.currentRole)
    ) {
      query.andWhere('user.username = :username', {
        username: queryEntity.username,
      });
    }

    if (queryEntity.username) {
      query.andWhere('user.username = :username', {
        username: queryEntity.username,
      });
    }

    if (queryEntity.sort_by) {
      queryEntity.sort_by.forEach((sortField) => {
        const order = sortField.includes('-') ? 'DESC' : 'ASC';
        const field = sortField.replace(/[+-]/, '');
        const relationField = field;
        query.addOrderBy(`media.${relationField}`, order);
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
