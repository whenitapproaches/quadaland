import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  @Post()
  create(
    @Body() createAvatarDto: CreateAvatarDto,
    @User('id') currentUserId: UserEntity['id'],
  ) {
    return this.avatarsService.create(createAvatarDto, currentUserId);
  }

  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
    @User('id') currentUserId: UserEntity['id'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.avatarsService.update(
      +id,
      updateAvatarDto,
      currentUserId,
      currentRole,
    );
  }

  @Auth([RoleEnum.Admin, RoleEnum.Superuser, RoleEnum.Company])
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User('id') currentUserId: UserEntity['id'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.avatarsService.remove(+id, currentUserId, currentRole);
  }
}
