import { classToPlain } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { QueryBookmarkEntityDto } from './dto/query-bookmark.dto';
import { BookmarkEntity } from './entities/bookmark.entity';

@EntityRepository(BookmarkEntity)
export class BookmarkRepository extends Repository<BookmarkEntity> {
  async findByQueriesWithCondition(
    queryEntity: QueryBookmarkEntityDto,
    conditions,
  ) {
    const query = this.createQueryBuilder('bookmark');

    if (queryEntity.sort_by) {
      queryEntity.sort_by.forEach((sortField) => {
        const order = sortField.includes('-') ? 'DESC' : 'ASC';
        const field = sortField.replace(/[+-]/, '');
        const relationField = `bookmark.${field}`;
        query.addOrderBy(relationField, order);
      });
    }

    query.leftJoinAndSelect('bookmark.user', 'user');
    query.leftJoinAndSelect('bookmark.property', 'property');
    query.leftJoinAndSelect('property.details', 'details');

    if (conditions.byUsername) {
      query.andWhere('user.username = :username', {
        username: conditions.byUsername,
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
