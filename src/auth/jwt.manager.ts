export class JwtManager {
  private static instance: JwtManager;

  private constructor() {}

  public static getInstance(): JwtManager {
    if (!JwtManager.instance) {
      JwtManager.instance = new JwtManager();
    }

    return JwtManager.instance;
  }

  #revokedTokens: Array<string> = [];

  revoke(token) {
    this.#revokedTokens.push(token);
  }

  getRevokedTokens(): Array<string> {
    return this.#revokedTokens;
  }

  extractTokenFromAuthorizationHeader(authorizationHeader: string): string {
    const bearer = 'Bearer ';

    const token = authorizationHeader.slice(bearer.length);

    return token;
  }
}
