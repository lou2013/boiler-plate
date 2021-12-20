import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as Sentry from 'winston-transport-sentry-node';
import { SentryConfig } from '../config/sentry.config';

export const WinstonLogger = (sentryConfig: SentryConfig) =>
  WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      new Sentry.default({
        sentry: {
          dsn: sentryConfig.url,
        },
        level: 'error',
      }),
    ],
  });
