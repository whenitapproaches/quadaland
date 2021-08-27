import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertiesService } from 'src/properties/properties.service';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DuplicatedException } from 'src/_common/exceptions/duplicated.exception';
import { BookmarkRepository } from './bookmarks.repository';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { QueryBookmarkEntityDto } from './dto/query-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly usersService: UsersService,
    private readonly propertiesService: PropertiesService,
  ) {}

  async createByUsername(
    createBookmarkDto: CreateBookmarkDto,
    username: UserEntity['username'],
    role: RoleEnum,
  ) {
    const user = await this.usersService.findOneOrFail(username);

    const property = await this.propertiesService.findById(
      createBookmarkDto.property_id,
    );

    const existedBookmark = await this.bookmarkRepository.findOne({
      property,
      user,
    });

    if (existedBookmark) {
      throw new DuplicatedException({
        message: 'duplicated.bookmark',
      });
    }

    let scopedProperty = property;

    if ([RoleEnum.Company, RoleEnum.Customer].includes(role)) {
      scopedProperty = await this.propertiesService.findOneScopedByUser(
        property.slug,
        username,
      );
    }

    const bookmark = await this.bookmarkRepository.create({
      property: scopedProperty,
      user,
    });

    return this.bookmarkRepository.save(bookmark);
  }

  async findOneOrFail(id: number) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id },
      relations: ['user', 'property'],
    });

    if (!bookmark)
      throw new NotFoundException({
        message: 'not_found.bookmark',
      });

    return bookmark;
  }

  async findAll(
    queryBookmarkEntityDto: QueryBookmarkEntityDto,
    username: UserEntity['username'],
  ) {
    return await this.bookmarkRepository.findByQueriesWithCondition(
      queryBookmarkEntityDto,
      {
        byUsername: username,
      },
    );
  }

  async removeByUsername(
    id: number,
    username: UserEntity['username'],
    role: RoleEnum,
  ) {
    const bookmark = await this.findOneOrFail(id);

    if (
      [RoleEnum.Company, RoleEnum.Customer].includes(role) &&
      bookmark.user.username !== username
    ) {
      throw new ForbiddenException({
        message: 'forbidden.delete.other.bookmark',
      });
    }

    await this.bookmarkRepository.remove(bookmark);

    return {
      success: true,
    };
  }
}
