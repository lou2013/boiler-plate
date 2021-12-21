import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './common/logger/logger';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { ErrorFilter } from './common/filters/error.filter';
import { Logger } from '@nestjs/common';
import { SerializerInterceptor } from './common/Interceptors/serializer.interceptor';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './common/config/server.config';
import { swaggerBootstrap } from './app.swagger';
import * as helmet from 'helmet';
import { AppConfigs } from './constants/app.configs';
import { SentryConfig } from './common/config/sentry.config';
import { SentryService } from '@ntegral/nestjs-sentry';
import { ErrorService } from './api/v1/modules/error/service/error.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.useLogger(
    WinstonLogger(configService.get<SentryConfig>(AppConfigs.SENTRY)),
  );
  const serverConfig = configService.get<ServerConfig>(AppConfigs.SERVER);

  const errorService = app.get(ErrorService);

  app.useGlobalInterceptors(SerializerInterceptor(app));

  app.useGlobalFilters(
    new ErrorFilter(
      Logger,
      app.get<SentryService>(SentryService),
      errorService,
    ),
  );

  app.useGlobalPipes(GlobalValidationPipe);
  app.use(helmet());
  app.enableCors();
  swaggerBootstrap(app);
  await app.listen(serverConfig.port, serverConfig.host);
}
bootstrap();
