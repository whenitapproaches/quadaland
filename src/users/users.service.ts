import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserEntityDto } from './dto/query-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RoleEnum } from 'src/roles/role.enum';
import { CompaniesService } from 'src/companies/companies.service';
import { AvatarEntity } from 'src/avatars/entities/avatar.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async existByUsername(username: UserEntity['username']): Promise<boolean> {
    const existingUser = await this.usersRepository.findOne(
      {
        username,
      },
      {
        relations: ['role'],
        withDeleted: true,
      },
    );
    return !!existingUser;
  }

  async hasAvatar(userId: UserEntity['id']) {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['avatar'],
    });
    console.log(user);

    if (user && user['avatar']) return true;
    return false;
  }

  async removeAvatar(userId: UserEntity['id']) {
    const user = await this.usersRepository.findOne(userId);
    user.avatar = null;
    return await this.usersRepository.save(user);
  }

  async updateAvatar(userId: UserEntity['id'], avatar: AvatarEntity) {
    const user = await this.usersRepository.findOne(userId);
    user.avatar = avatar;
    return await this.usersRepository.save(user);
  }

  async getAvatar(userId: UserEntity['id']) {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['avatar'],
    });
    return user ? user['avatar'] : false;
  }

  async changePassword(
    username: UserEntity['username'],
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.findOneOrFail(username);

    const doesPasswordMatches = await user.checkPassword(
      changePasswordDto.old_password,
    );

    if (!doesPasswordMatches)
      throw new UnauthorizedException({
        message: 'old_password.not_matched',
      });

    user.password = changePasswordDto.new_password;

    await this.usersRepository.save(user);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (await this.existByUsername(createUserDto.username)) {
      throw new HttpException('existed.read.user', HttpStatus.NOT_FOUND);
    }

    const { role: roleDto, ...createUserObject } = createUserDto;

    const savedUser = await this.usersRepository.create(createUserObject);

    const role = await this.rolesService.findOne(roleDto);
    savedUser.role = role;

    return await this.usersRepository.save(savedUser);
  }

  async findAll(queryUserEntityDto: QueryUserEntityDto) {
    return await this.usersRepository.findByQueriesWithCondition(
      queryUserEntityDto,
      {},
      { withDeleted: true },
    );
  }

  async findOneOrFail(username: UserEntity['username']) {
    const user = await this.usersRepository.findOne(
      { username },
      {
        relations: ['role', 'avatar', 'avatar.media'],
      },
    );

    if (!user)
      throw new NotFoundException({
        message: 'not_found.read.user',
      });

    return user;
  }

  async findOne(username: UserEntity['username']) {
    const user = await this.usersRepository.findOne(
      { username },
      {
        relations: ['role', 'avatar', 'avatar.media'],
      },
    );

    return user;
  }

  async restore(username: UserEntity['username']) {
    await this.customersService.restore(username);

    await this.companiesService.restore(username);

    await this.usersRepository.restore({ username });

    return {
      success: true,
    };
  }

  async update(
    username: UserEntity['username'],
    currentUsername: UserEntity['username'],
    updateUserDto: UpdateUserDto,
    currentRole: RoleEnum,
  ) {
    const user = await this.findOneOrFail(username);

    if (user.role.name === RoleEnum.Superuser && username !== currentUsername)
      throw new ForbiddenException({
        message: 'not_allowed.update.super_user',
      });

    if (
      [RoleEnum.Admin].includes(currentRole) &&
      username !== currentUsername &&
      user.role.name === RoleEnum.Admin
    )
      throw new ForbiddenException({
        message: 'not_allowed.update.other_admin',
      });

    const resultUser = await this.usersRepository.merge(user, updateUserDto);

    await this.usersRepository.save(resultUser);

    return resultUser;
  }

  async findById(userId: UserEntity['id']) {
    return await this.usersRepository.findOne(userId);
  }

  async remove(username: UserEntity['username']) {
    const user = await this.findOneOrFail(username);

    await this.customersService.remove(username);

    await this.companiesService.remove(username);

    await this.usersRepository.softDelete({ username });

    return user;
  }

  async activate(username) {
    const user = await this.findOne(username);

    if (!user) return;

    const resultUser = await this.usersRepository.merge(user, {
      activation_token: null,
      is_active: true,
    });

    await this.usersRepository.save(resultUser);
  }
}
