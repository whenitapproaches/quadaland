import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtManager } from './jwt.manager';

@Injectable()
export class JwtAuthOptionalGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!this.validateIfTokenRevoked(request)) return true;

    return super.canActivate(context);
  }

  private validateIfTokenRevoked(request: Request) {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) return false;

    const jwtManager = JwtManager.getInstance();

    const token = jwtManager.extractTokenFromAuthorizationHeader(
      authorizationHeader,
    );

    if (!token || this.isTokenRevoked(token)) return false;

    return true;
  }

  private isTokenRevoked(token: string): boolean {
    const jwtManager = JwtManager.getInstance();

    const revokedTokens = jwtManager.getRevokedTokens();

    if (revokedTokens.includes(token)) {
      return true;
    }

    return false;
  }

  handleRequest(err, user, info, context) {
    return user;
  }
}
