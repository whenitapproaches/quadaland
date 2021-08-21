import { classToPlain } from 'class-transformer';
import { BookmarkEntity } from 'src/bookmarks/entities/bookmark.entity';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { QueryPropertyEntityDto } from './dto/query-property.dto';
import { PropertyEntity } from './entities/property.entity';
import { PropertySortableFields } from './property-sortable-fields';

@EntityRepository(PropertyEntity)
export class PropertyRepository extends Repository<PropertyEntity> {
  async findByCoordinates(
    queryEntity: QueryPropertyEntityDto,
    geolocationService: GeolocationService,
    currentUserId: UserEntity['id'],
  ) {
    const query = this.createQueryBuilder('property');

    query.andWhere('property.approval_status = true');

    const { coordinates, radius } = classToPlain(queryEntity);

    const { maxX, minX, maxY, minY } = geolocationService.getBoundaries(
      coordinates,
      radius,
    );

    query
      .leftJoinAndSelect('property.details', 'details')
      .leftJoinAndSelect('details.media', 'media')
      .andWhere('details.latitude > :minX', { minX })
      .andWhere('details.latitude < :maxX', { maxX })
      .andWhere('details.longitude < :maxY', { maxY })
      .andWhere('details.longitude > :minY', { minY })
      .leftJoinAndSelect('property.company', 'company')
      .leftJoinAndSelect('property.sale_method', 'sale_method')
      .leftJoinAndSelect('company.user', 'user')
      .leftJoinAndMapOne(
        'property.bookmark',
        BookmarkEntity,
        'bookmark',
        'bookmark.property_id = property.id and bookmark.user = :currentUserId',
        { currentUserId },
      );

    const properties = classToPlain(await query.getMany());

    return properties.filter((property) =>
      geolocationService.isPropertyWithinRegion(
        property.details.coordinate,
        coordinates,
        radius,
      ),
    );
  }

  async findByQueriesWithCondition(
    queryEntity: QueryPropertyEntityDto,
    conditions,
    { withDeleted },
    currentUserId: UserEntity['id'],
  ) {
    const query = this.createQueryBuilder('property');

    if (withDeleted) query.withDeleted();

    query
      .leftJoinAndSelect('property.company', 'company')
      .leftJoinAndSelect('property.details', 'details')
      .leftJoinAndSelect('details.media', 'media')
      .leftJoinAndSelect('property.sale_method', 'sale_method')
      .leftJoinAndSelect('company.user', 'user')
      .leftJoinAndMapOne(
        'property.bookmark',
        BookmarkEntity,
        'bookmark',
        'bookmark.property_id = property.id and bookmark.user_id = :currentUserId',
        { currentUserId },
      );

    if (queryEntity.search) {
      const searchQuery = `%${queryEntity.search.toLowerCase()}%`;

      query.andWhere(
        new Brackets((qb) => {
          qb.where('details.address LIKE :search', {
            search: searchQuery,
          })
            .orWhere('details.title LIKE :search', {
              search: searchQuery,
            })
            .orWhere('details.description LIKE :search', {
              search: searchQuery,
            });
        }),
      );
    }

    if (queryEntity.sale_method)
      query.andWhere('sale_method.name = :sale_method', {
        sale_method: queryEntity.sale_method,
      });

    if (queryEntity.min_price)
      query.andWhere('details.price > :min_price', {
        min_price: queryEntity.min_price,
      });

    if (queryEntity.max_price)
      query.andWhere('details.price < :max_price', {
        max_price: queryEntity.max_price,
      });

    if (queryEntity.min_area)
      query.andWhere('details.area > :min_area', {
        min_area: queryEntity.min_area,
      });

    if (queryEntity.max_area)
      query.andWhere('details.area < :max_area', {
        max_area: queryEntity.max_area,
      });

    if (queryEntity.sort_by) {
      queryEntity.sort_by.forEach((sortField) => {
        const order = sortField.includes('-') ? 'DESC' : 'ASC';
        const field = sortField.replace(/[+-]/, '');
        const relationField = PropertySortableFields[field];
        query.addOrderBy(relationField, order);
      });
    }

    // tat ca bai da xoa, chap thuan va chua chap thuan

    if (conditions.byCompany) {
      if (queryEntity.username) {
        query.andWhere('user.username = :username', {
          username: queryEntity.username,
        });
        if (conditions.byCompany !== queryEntity.username) {
          query.andWhere('property.approval_status = true');
          query.andWhere('property.deleted_at IS NULL');
        }
      }
    } else {
      if (conditions.is_approved) {
        query.andWhere('property.approval_status = true');
      }
    }

    if (conditions.username)
      query.andWhere('user.username = :username', {
        username: conditions.username,
      });

    if (queryEntity.username)
      query.andWhere('user.username = :username', {
        username: queryEntity.username,
      });

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
