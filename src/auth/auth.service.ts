import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(credential: SignInDto) {
    const user = await this.usersService.findOne(credential.username);

    if (!user) throw new NotFoundException();

    if (await user.checkPassword(credential.password)) {
      const payload = { username: user.username };
      return { access_token: this.jwtService.sign(payload) };
    }

    throw new UnauthorizedException();
  }

  async signUp() {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
}
