import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
  ForbiddenException,
  Body,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaEntity } from './entities/media.entity';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from 'src/_common/utils/file-upload.utils';
import { RoleEnum } from 'src/roles/role.enum';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import * as path from 'path';
import { ROOT_PATH } from '_root-path';
import { QueryMediaEntityDto } from './dto/query-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'files',
          maxCount: 5,
        },
      ],
      {
        storage: diskStorage({
          destination: path.resolve(ROOT_PATH, 'storage/uploads'),
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
        limits: {
          fileSize: 5 * 1024 ** 2,
        },
      },
    ),
  )
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.mediaService.create(files, currentUsername, currentRole);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(
    @Param('slug') slug: MediaEntity['slug'],
    @Res() response: Response,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    return this.mediaService.serve(
      slug,
      response,
      currentUsername,
      currentRole,
    );
  }

  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  @Get()
  findMany(
    @Query() queryMediaEntityDto: QueryMediaEntityDto,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    if (
      [RoleEnum.Company].includes(currentRole) &&
      queryMediaEntityDto.username &&
      queryMediaEntityDto.username !== currentUsername
    ) {
      throw new ForbiddenException({
        message: 'not_allowed.read_many.other_owner_media',
      });
    }

    return this.mediaService.findAll(
      queryMediaEntityDto,
      currentUsername,
      currentRole,
    );
  }

  @Delete(':slug')
  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  remove(
    @Param('slug') slug: string,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.mediaService.remove(slug, currentUsername, currentRole);
  }

  @Delete()
  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  removeMany(
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
    @Body() deleteMediaDto: DeleteMediaDto,
  ) {
    return this.mediaService.removeMany(
      deleteMediaDto,
      currentUsername,
      currentRole,
    );
  }
}
