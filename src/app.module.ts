import { Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V1Module } from './api/v1/v1.module';
import { AppController } from './app.controller';
import { LoadConfigs } from './common/config/configs';
import { DatabaseModule } from './shared/database/database.module';
import { QueueModule } from './shared/queue/queue.module';
import { RedisModule } from './shared/redis/redis.module';
import { SentryModule } from './shared/sentry/sentry.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [LoadConfigs],
    }),
    SentryModule,
    QueueModule,
    DatabaseModule,
    RedisModule,
    V1Module,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
