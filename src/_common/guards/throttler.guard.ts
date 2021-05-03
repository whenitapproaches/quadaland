import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import rateLimitingConfig from 'src/_config/rate-limiting.config';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  #config: ConfigType<typeof rateLimitingConfig>;

  readonly HEADER_TESTING_ACCESS_KEY = 'qdl_tak';

  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    @Inject(rateLimitingConfig.KEY)
    private config: ConfigType<typeof rateLimitingConfig>,
  ) {
    super(options, storageService, reflector);
    this.#config = config;
  }

  private hasRequestTestAccessKey(request) {
    const configTestingAccessKey = this.#config.testing?.access_key;

    if (
      request.headers[this.HEADER_TESTING_ACCESS_KEY] === configTestingAccessKey
    ) {
      return true;
    }
    return false;
  }

  async handleRequest(context: ExecutionContext, limit, ttl) {
    const { req, res } = this.getRequestResponse(context);

    if (this.hasRequestTestAccessKey(req)) {
      ttl = this.#config.testing.ttl;
      limit = this.#config.testing.limit;
    }

    if (Array.isArray(this.options.ignoreUserAgents)) {
      for (const pattern of this.options.ignoreUserAgents) {
        if (pattern.test(req.headers['user-agent'])) {
          return true;
        }
      }
    }
    const tracker = this.getTracker(req);
    const key = this.generateKey(context, tracker);
    const ttls = await this.storageService.getRecord(key);
    const nearestExpiryTime =
      ttls.length > 0 ? Math.ceil((ttls[0] - Date.now()) / 1000) : 0;
    if (ttls.length >= limit) {
      res.header('Retry-After', nearestExpiryTime);
      throw new ThrottlerException(this.errorMessage);
    }
    res.header(`${this.headerPrefix}-Limit`, limit);
    res.header(
      `${this.headerPrefix}-Remaining`,
      Math.max(0, limit - (ttls.length + 1)),
    );
    res.header(`${this.headerPrefix}-Reset`, nearestExpiryTime);
    await this.storageService.addRecord(key, ttl);
    return true;
  }
}
