import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { AppConfigs } from '../../constants/app.configs';
import { RedisConfig } from '../../common/config/redis.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.get<RedisConfig>(
          AppConfigs.REDIS_CACHE,
        );
        return {
          catch: (err) => {
            console.log(`error on bull module level`);
            console.log(err);
          },
          prefix: 'bull',
          redis: { host: config.host, port: config.port },
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class QueueModule {}
