import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtManager } from './jwt.manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.validateIfTokenRevoked(request);

    return super.canActivate(context);
  }

  private validateIfTokenRevoked(request: Request) {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) throw new UnauthorizedException();

    const jwtManager = JwtManager.getInstance();

    const token = jwtManager.extractTokenFromAuthorizationHeader(
      authorizationHeader,
    );

    if (!token || this.isTokenRevoked(token)) {
      throw new UnauthorizedException();
    }
  }

  private isTokenRevoked(token: string): boolean {
    const jwtManager = JwtManager.getInstance();

    const revokedTokens = jwtManager.getRevokedTokens();

    if (revokedTokens.includes(token)) {
      return true;
    }

    return false;
  }
}
