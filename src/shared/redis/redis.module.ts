import { Module } from '@nestjs/common';
import { RedisModule as RedisInternalModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '../../common/config/redis.config';
import { AppConfigs } from '../../constants/app.configs';
@Module({
  imports: [
    RedisInternalModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const main = configService.get<RedisConfig>(AppConfigs.REDIS_MAIN);
        const cache = configService.get<RedisConfig>(AppConfigs.REDIS_CACHE);
        const pubsub = configService.get<RedisConfig>(AppConfigs.REDIS_PUBSUB);
        return {
          config: [
            {
              namespace: main.name,
              name: main.name,
              db: main.db,
              host: main.host,
              keyPrefix: main.keyPrefix,
              password: main.password,
              port: main.port,
              username: main.username,
            },
            {
              namespace: cache.name,
              name: cache.name,
              db: cache.db,
              host: cache.host,
              keyPrefix: cache.keyPrefix,
              password: cache.password,
              port: cache.port,
              username: cache.username,
            },
            {
              namespace: pubsub.name,
              name: pubsub.name,
              db: pubsub.db,
              host: pubsub.host,
              keyPrefix: pubsub.keyPrefix,
              password: pubsub.password,
              port: pubsub.port,
              username: pubsub.username,
            },
          ],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RedisModule {}
