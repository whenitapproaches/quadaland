import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() credential: SignInDto) {
    return this.authService.signIn(credential);
  }

  @Post('sign-up')
  async signUp() {
    return this.authService.signUp();
  }
}
