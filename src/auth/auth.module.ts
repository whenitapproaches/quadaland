import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersModule } from 'src/customers/customers.module';
import { PusherModule } from 'src/pusher/pusher.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AuthListener } from './listeners/auth.listener';

@Module({
  imports: [
    UsersModule,
    CustomersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') },
      }),
    }),
    PusherModule,
    NotificationsModule,
  ],
  providers: [AuthService, JwtStrategy, AuthListener],
  controllers: [AuthController],
})
export class AuthModule {}
