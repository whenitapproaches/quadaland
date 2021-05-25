import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() credential: SignInDto) {
    return this.authService.signIn(credential);
  }

  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Headers('authorization') authorizationHeader: string) {
    return this.authService.signOut(authorizationHeader);
  }
}
