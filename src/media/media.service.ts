import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { CompaniesService } from 'src/companies/companies.service';
import { CompanyEntity } from 'src/companies/entities/company.entity';
import { RoleEnum } from 'src/roles/role.enum';
import { StoragesService } from 'src/storages/storages.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Connection, In } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
import { MediaTypeEnum } from './media-type.enum';
import { MediaVisibilityEnum } from './media-visibility.enum';
import { MediaRepository } from './media.repository';
import * as path from 'path';
import { ROOT_PATH } from '_root-path';
import { QueryMediaEntityDto } from './dto/query-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly connection: Connection,
    private readonly companiesService: CompaniesService,
    private readonly storagesService: StoragesService,
    private readonly usersService: UsersService,
  ) {}

  private fileToCreateMediaDto(file, user: UserEntity) {
    return {
      slug: file.filename,
      file_name: file.originalname,
      file_size: file.size,
      path: `storage/uploads/${file.filename}`,
      type:
        file.mimetype === 'image/jpeg'
          ? MediaTypeEnum.Image
          : MediaTypeEnum.Video,
      visibility: MediaVisibilityEnum.Public,
      user,
    };
  }

  private checkStorageLimit(media: MediaEntity[], newTotalSize) {
    const totalSize = media.reduce(
      (totalSize, media) => totalSize + media.file_size,
      0,
    );

    return totalSize + newTotalSize < 30 * 1024 ** 2;
  }

  private async uploadByCompany(createMediaDtos, currentUsername) {
    const company = await this.companiesService.findOneWithMedia(
      currentUsername,
    );

    const isStorageFree = this.checkStorageLimit(
      company.media,
      createMediaDtos.reduce(
        (totalSize, file) => totalSize + file.file_size,
        0,
      ),
    );

    if (!isStorageFree) {
      await Promise.all(
        createMediaDtos.map(async (media) =>
          this.storagesService.removeFile(media.path),
        ),
      );

      throw new UnprocessableEntityException({
        message: 'not_enough.storage',
      });
    }

    const createdMedia = await this.mediaRepository.create(createMediaDtos);

    await this.mediaRepository.save(createdMedia);

    const query = await this.connection
      .createQueryBuilder()
      .relation(CompanyEntity, 'media')
      .of(company.id);

    createdMedia.forEach((media) => {
      query.add(media.id);
    });

    return createdMedia;
  }

  private async uploadByAdmin(createMediaDtos) {
    const createdMedia = await this.mediaRepository.create(createMediaDtos);

    await this.mediaRepository.save(createdMedia);

    return createdMedia;
  }

  async create(
    requestFiles,
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    const reflectedFiles = Reflect.ownKeys(requestFiles);

    if (!reflectedFiles.length) {
      throw new BadRequestException({
        message: 'missing.files',
      });
    }

    const files = reflectedFiles.map((key) => {
      return requestFiles[key];
    })[0];

    const user = await this.usersService.findOne(currentUsername);

    const createMediaDtos = files.map((file) =>
      this.fileToCreateMediaDto(file, user),
    );

    if ([RoleEnum.Company].includes(currentRole)) {
      return this.uploadByCompany(createMediaDtos, currentUsername);
    }
    return this.uploadByAdmin(createMediaDtos);
  }

  async findAll(
    queryMediaEntityDto: QueryMediaEntityDto,
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    const media = await this.mediaRepository.findByQueriesWithCondition(
      queryMediaEntityDto,
      {
        currentRole,
        currentUsername,
      },
    );

    if ([RoleEnum.Company].includes(currentRole)) {
      return {
        ...media,
        storage: {
          allowance: 50 * 1024 ** 2,
          used: await this.mediaRepository.getRemainingStorageByUsername(
            currentUsername,
          ),
        },
      };
    }

    return media;
  }

  findOne(slug: MediaEntity['slug']) {
    return this.mediaRepository.findOne(
      { slug },
      {
        relations: ['user'],
      },
    );
  }

  findAllBySlugs(slugs: MediaEntity['slug'][]) {
    return this.mediaRepository.find({
      slug: In(slugs),
    });
  }

  async serve(
    slug: MediaEntity['slug'],
    response: Response,
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    const media = await this.findOne(slug);

    if (!media)
      throw new NotFoundException({
        message: 'not_found.read.media',
      });

    if (![RoleEnum.Admin, RoleEnum.Superuser].includes(currentRole)) {
      if (!currentRole && media.visibility === MediaVisibilityEnum.Private) {
        throw new ForbiddenException({
          message: 'not_allowed.read.private_media',
        });
      }

      if (
        currentUsername !== media.user.username &&
        media.visibility === MediaVisibilityEnum.Private
      ) {
        throw new ForbiddenException({
          message: 'not_allowed.read.private_media',
        });
      }
    }

    return response.sendFile(path.resolve(ROOT_PATH, media.path));
  }

  async remove(
    slug: MediaEntity['slug'],
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    const media = await this.findOne(slug);

    if (!media)
      throw new NotFoundException({
        message: 'not_found.read.media',
      });

    if (
      [RoleEnum.Company].includes(currentRole) &&
      media.user.username !== currentUsername
    )
      throw new ForbiddenException({
        message: 'not_allowed.delete.other_owner_media',
      });

    await this.storagesService.removeFile(media.path);

    await this.mediaRepository.remove(media);

    return {
      success: true,
    };
  }

  async removeMany(
    deleteMediaDto: DeleteMediaDto,
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    const media = await Promise.all(
      deleteMediaDto.slugs.map(async (slug) => {
        const media = await this.findOne(slug);

        if (!media)
          throw new NotFoundException({
            message: 'not_found.read.media',
          });

        if (
          [RoleEnum.Company].includes(currentRole) &&
          media.user.username !== currentUsername
        )
          throw new ForbiddenException({
            message: 'not_allowed.delete.other_owner_media',
          });

        return media;
      }),
    );

    media.forEach(async (medium) => {
      await this.storagesService.removeFile(medium.path);

      await this.mediaRepository.remove(medium);
    });

    return {
      success: true,
    };
  }
}
