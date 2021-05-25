import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from 'src/roles/role.enum';
import { Auth } from 'src/auth/auth.decorator';
import { QueryUserEntityDto } from './dto/query-user.dto';
import { UserEntity } from './entities/user.entity';
import { User } from './user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth([RoleEnum.Superuser])
  @Post('restore/:username')
  @HttpCode(200)
  restore(@Param('username') username: UserEntity['username']) {
    return this.usersService.restore(username);
  }

  @Auth([
    RoleEnum.Superuser,
    RoleEnum.Admin,
    RoleEnum.Company,
    RoleEnum.Customer,
  ])
  @Post('change-password')
  @HttpCode(200)
  changePassword(
    @User('username') currentUsername: UserEntity['username'],
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(currentUsername, changePasswordDto);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Get()
  findAll(@Query() queryUserEntityDto: QueryUserEntityDto) {
    return this.usersService.findAll(queryUserEntityDto);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Company, RoleEnum.Admin])
  @Get(':username')
  findOne(@Param('username') username: UserEntity['username']) {
    return this.usersService.findOneOrFail(username);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Patch(':username')
  update(
    @Param('username') username: UserEntity['username'],
    @Body() updateUserDto: UpdateUserDto,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    return this.usersService.update(
      username,
      currentUsername,
      updateUserDto,
      currentRole,
    );
  }

  @Auth([RoleEnum.Superuser])
  @Delete(':username')
  remove(
    @Param('username') username: UserEntity['username'],
    @User('username') currentUsername: UserEntity['username'],
  ) {
    if (username === currentUsername)
      throw new ForbiddenException({
        message: 'not_allowed.delete.self',
      });

    return this.usersService.remove(username);
  }
}
