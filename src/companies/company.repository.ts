import { classToPlain } from 'class-transformer';
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

    query.leftJoinAndSelect('company.user', 'user');

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
