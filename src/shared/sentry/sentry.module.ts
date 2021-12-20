import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentryModule as sentModule } from '@ntegral/nestjs-sentry';
import { SentryConfig } from '../../common/config/sentry.config';
import { AppConfigs } from '../../constants/app.configs';

@Module({
  imports: [
    sentModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.get<SentryConfig>(AppConfigs.SENTRY);

        return {
          dsn: config.url,
          debug: true,
          environment: 'production',
          logLevel: 0,
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class SentryModule {}
