import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { MediaModule } from 'src/media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarRepository } from './avatar.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MediaModule,
    UsersModule,
    TypeOrmModule.forFeature([AvatarRepository]),
  ],
  controllers: [AvatarsController],
  providers: [AvatarsService],
})
export class AvatarsModule {}
