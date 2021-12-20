import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleApiService } from './service/google-api.service';
import { RedisModule } from '../../../../shared/redis/redis.module';

@Module({
  imports: [
    HttpModule.register({
      validateStatus: (status) => status < 500,
    }),
    RedisModule,
  ],
  controllers: [],
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class ApiServicesModule {}
