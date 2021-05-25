import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaRepository } from './media.repository';
import { CompaniesModule } from 'src/companies/companies.module';
import { StoragesModule } from 'src/storages/storages.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaRepository]),
    CompaniesModule,
    StoragesModule,
    UsersModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
