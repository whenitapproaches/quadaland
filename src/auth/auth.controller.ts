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
import { ForgotPasswordDto } from './dto/forgot-password.dto';

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

  @Post('activate')
  @HttpCode(200)
  async activate(@Body() body) {
    return this.authService.activateAccount(body.activation_token);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgot(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }

  @Post('verify-forgot-password')
  @HttpCode(200)
  async verifyForgotPassword(@Body() body) {
    return this.authService.resetAccount(body.forgot_password_token);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() payload: SignInDto) {
    return this.authService.resetPassword(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Headers('authorization') authorizationHeader: string) {
    return this.authService.signOut(authorizationHeader);
  }
}
