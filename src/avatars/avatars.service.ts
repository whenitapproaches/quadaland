import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaEntity } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DuplicatedException } from 'src/_common/exceptions/duplicated.exception';
import { AvatarRepository } from './avatar.repository';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarsService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly avatarRepository: AvatarRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createAvatarDto: CreateAvatarDto,
    currentUserId: UserEntity['id'],
  ) {
    const media = await this.mediaService.findOne(createAvatarDto.media);
    if (!media)
      throw new NotFoundException({
        message: 'not_found.media',
      });

    if (await this.usersService.hasAvatar(currentUserId))
      throw new DuplicatedException({
        message: 'duplicated.avatar',
      });

    const avatar = await this.avatarRepository.create();
    avatar.media = media;
    await this.avatarRepository.save(avatar);
    await this.usersService.updateAvatar(currentUserId, avatar);
    return avatar;
  }

  async update(
    id: number,
    updateAvatarDto: UpdateAvatarDto,
    currentUserId: UserEntity['id'],
    currentRole: RoleEnum,
  ) {
    const avatar = await this.avatarRepository.findOne(id);
    const userAvatar = await this.usersService.getAvatar(currentUserId);
    if (!avatar || !userAvatar)
      throw new NotFoundException({
        message: 'not_found.avatar',
      });

    if (
      userAvatar.id !== avatar.id &&
      [RoleEnum.Company].includes(currentRole)
    ) {
      throw new ForbiddenException({
        message: 'not_allowed.modify.others.avatar',
      });
    }

    const media = await this.mediaService.findOne(updateAvatarDto.media);
    if (!media)
      throw new NotFoundException({
        message: 'not_found.media',
      });

    avatar.media = media;
    await this.avatarRepository.save(avatar);

    return {
      success: true,
    };
  }

  async remove(
    id: number,
    currentUserId: UserEntity['id'],
    currentRole: RoleEnum,
  ) {
    const avatar = await this.avatarRepository.findOne(id);
    const userAvatar = await this.usersService.getAvatar(currentUserId);
    if (!avatar || !userAvatar)
      throw new NotFoundException({
        message: 'not_found.avatar',
      });

    if (
      userAvatar.id !== avatar.id &&
      [RoleEnum.Company].includes(currentRole)
    ) {
      throw new ForbiddenException({
        message: 'not_allowed.modify.others.avatar',
      });
    }

    await this.usersService.removeAvatar(currentUserId);
    await this.avatarRepository.remove(avatar);

    return {
      success: true,
    };
  }
}
