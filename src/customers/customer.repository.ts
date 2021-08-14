import { classToPlain } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { QueryCustomerEntityDto } from './dto/query-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {
  async findByQueriesWithCondition(
    queryEntity: QueryCustomerEntityDto,
    conditions,
    { withDeleted },
  ) {
    const query = this.createQueryBuilder('customer');

    if (withDeleted) query.withDeleted();

    if (queryEntity.sort_by) {
      queryEntity.sort_by.forEach((sortField) => {
        const order = sortField.includes('-') ? 'DESC' : 'ASC';
        const field = sortField.replace(/[+-]/, '');
        const relationField = `customer.${field}`;
        query.addOrderBy(relationField, order);
      });
    }

    query.leftJoinAndSelect('customer.user', 'user');

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
