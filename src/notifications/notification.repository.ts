import { classToPlain } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { QueryNotificationEntityDto } from './dto/query-notification.dto';
import { NotificationEntity } from './entities/notification.entity';

@EntityRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {
  async findByQueriesWithCondition(queryEntity: QueryNotificationEntityDto) {
    const query = this.createQueryBuilder('notification');

    query.orderBy('notification.created_at');

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
