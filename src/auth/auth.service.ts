import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import jwtConfig from 'src/_config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { DuplicatedException } from 'src/_common/exceptions/duplicated.exception';
import { JwtService } from '@nestjs/jwt';
import { JwtManager } from './jwt.manager';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RoleEnum } from 'src/roles/role.enum';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly customersService: CustomersService,
    @Inject(jwtConfig.KEY)
    private config: ConfigType<typeof jwtConfig>,
  ) {}

  async signIn(credential: SignInDto) {
    const user = await this.usersService.findOneOrFail(credential.username);

    if (await user.checkPassword(credential.password)) {
      const payload = { username: user.username, role: user.role.name };
      return {
        role: user.role.name,
        access_token: this.jwtService.sign(payload),
        expires_in: this.config.expiresIn,
      };
    }

    throw new UnauthorizedException();
  }

  async signUp(payload: SignUpDto) {
    const existedUser = await this.usersService.existByUsername(
      payload.username,
    );

    if (existedUser) throw new DuplicatedException();

    const createUserDto: CreateUserDto = {
      ...payload,
      role: RoleEnum.Customer,
    };

    const createdUser = await this.usersService.create(createUserDto);

    try {
      await this.customersService.create({
        address: null,
        phone: null,
        email: null,
        full_name: null,
        user: createdUser,
      });
    } catch (err) {
      console.log(err);
    }

    return {
      success: true,
      data: {
        username: payload.username,
      },
    };
  }

  async signOut(authorizationHeader: string) {
    const jwtManager = JwtManager.getInstance();

    const token = jwtManager.extractTokenFromAuthorizationHeader(
      authorizationHeader,
    );
    jwtManager.revoke(token);

    return {
      success: true,
    };
  }
}
