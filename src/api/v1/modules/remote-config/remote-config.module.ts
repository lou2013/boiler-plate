import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RemoteConfigController } from './controller/remote-config.controller';
import { RemoteConfig, RemoteConfigSchema } from './model/remote-config.entity';
import { RemoteConfigService } from './service/remote-config.service';
import { AuthorizationModule } from '../authorizaation/authorization.module';

@Global()
@Module({
  imports: [
    AuthorizationModule,
    MongooseModule.forFeature([
      { name: RemoteConfig.name, schema: RemoteConfigSchema },
    ]),
  ],
  controllers: [RemoteConfigController],
  providers: [RemoteConfigService, Logger],
  exports: [],
})
export class RemoteConfigModule {}
