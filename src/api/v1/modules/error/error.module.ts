import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ErrorController } from './controller/error.controller';
import { Error, ErrorSchema } from './model/error.entity';
import { ErrorService } from './service/error.service';
import { AuthorizationModule } from '../authorizaation/authorization.module';

// this is a module that is used in error filter it is used to save errors that occur in codes thorugh error service
@Global()
@Module({
  imports: [
    AuthenticationModule,
    AuthorizationModule,
    MongooseModule.forFeature([{ name: Error.name, schema: ErrorSchema }]),
  ],
  controllers: [ErrorController],
  providers: [ErrorService, Logger],
  exports: [],
})
export class ErrorModule {}
