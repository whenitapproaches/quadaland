import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from 'src/properties/properties.module';
import { UsersModule } from 'src/users/users.module';
import { BookmarksController } from './bookmarks.controller';
import { BookmarkRepository } from './bookmarks.repository';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    UsersModule,
    PropertiesModule,
    TypeOrmModule.forFeature([BookmarkRepository]),
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
