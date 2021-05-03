import { Logger, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import rateLimitingConfig from './_config/rate-limiting.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import swaggerConfig from './_config/swagger.config';
import appConfig from './_config/app.config';
import winstonConfig from './_config/winston.config';
import { WinstonModule } from 'nest-winston';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AppThrottlerGuard } from './_common/guards/throttler.guard';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './_config/jwt.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [
        winstonConfig,
        rateLimitingConfig,
        jwtConfig,
        swaggerConfig,
        appConfig,
      ],
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('winston'),
    }),
    TypeOrmModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('rate-limiting.ttl'),
        limit: config.get('rate-limiting.limit'),
      }),
    }),
    MorganModule,
    UsersModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('tiny'),
    },
  ],
})
export class AppModule {}
