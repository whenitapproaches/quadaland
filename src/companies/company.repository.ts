import { classToPlain } from 'class-transformer';
import { AvatarEntity } from 'src/avatars/entities/avatar.entity';
import { EntityRepository, Repository } from 'typeorm';
import { QueryCompanyEntityDto } from './dto/query-company';
import { CompanyEntity } from './entities/company.entity';

@EntityRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {
  async findByQueriesWithCondition(
    queryEntity: QueryCompanyEntityDto,
    conditions,
    { withDeleted },
  ) {
    const query = this.createQueryBuilder('company');

    if (withDeleted) query.withDeleted();

    if (queryEntity.sort_by) {
      queryEntity.sort_by.forEach((sortField) => {
        const order = sortField.includes('-') ? 'DESC' : 'ASC';
        const field = sortField.replace(/[+-]/, '');
        const relationField = `company.${field}`;
        query.addOrderBy(relationField, order);
      });
    }

    query
      .leftJoinAndSelect('company.user', 'user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('avatar.media', 'media_avatar');

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
