import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UpdateResourceController } from './controller/update-resource.controller';
import {
  UpdateResource,
  UpdateResourceSchema,
} from './model/update-resource.entity';
import { UpdateResourceService } from './service/update-resource.service';
import { AuthorizationModule } from '../authorizaation/authorization.module';

@Global()
@Module({
  imports: [
    AuthenticationModule,
    AuthorizationModule,
    MongooseModule.forFeature([
      { name: UpdateResource.name, schema: UpdateResourceSchema },
    ]),
  ],
  controllers: [UpdateResourceController],
  providers: [UpdateResourceService, Logger],
  exports: [UpdateResourceService],
})
export class UpdateResourceModule {}
