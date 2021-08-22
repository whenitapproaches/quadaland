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
import { CustomersModule } from './customers/customers.module';
import { CompaniesModule } from './companies/companies.module';
import { PropertiesModule } from './properties/properties.module';
import { MediaModule } from './media/media.module';
import jwtConfig from './_config/jwt.config';
import morganConfig from './_config/morgan.config';
import { PropertySaleMethodsModule } from './property-sale-methods/property-sale-methods.module';
import { PropertyDetailsModule } from './property-details/property-details.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StoragesModule } from './storages/storages.module';
import { PusherModule } from './pusher/pusher.module';
import pusherConfig from './_config/pusher.config';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { AvatarsModule } from './avatars/avatars.module';
import { DashboardModule } from './dashboard/dashboard.module';
import mailConfig from './_config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [
        winstonConfig,
        rateLimitingConfig,
        jwtConfig,
        swaggerConfig,
        pusherConfig,
        appConfig,
        mailConfig,
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
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    MorganModule,
    RolesModule,
    UsersModule,
    RolesModule,
    AuthModule,
    CustomersModule,
    CompaniesModule,
    PropertiesModule,
    MediaModule,
    PropertySaleMethodsModule,
    PropertyDetailsModule,
    BookmarksModule,
    GeolocationModule,
    NotificationsModule,
    StoragesModule,
    PusherModule,
    AvatarsModule,
    DashboardModule,
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
      useClass: MorganInterceptor(morganConfig),
    },
  ],
})
export class AppModule {}
