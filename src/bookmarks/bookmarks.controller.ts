import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { QueryBookmarkEntityDto } from './dto/query-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.bookmarksService.createByUsername(
      createBookmarkDto,
      currentUsername,
      currentRole,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findMany(
    @Query() queryBookmarkEntityDto: QueryBookmarkEntityDto,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    return this.bookmarksService.findAll(
      queryBookmarkEntityDto,
      currentUsername,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: number,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.bookmarksService.removeByUsername(
      id,
      currentUsername,
      currentRole,
    );
  }
}
