import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import swagger from './_swagger/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'development',
    cors: true,
  });
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix(`api/${configService.get('app.api.version')}`);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  swagger(app, configService.get('swagger'));

  app.enableCors();

  app.use(helmet());

  await app.listen(configService.get('app.port'));
}
bootstrap();
