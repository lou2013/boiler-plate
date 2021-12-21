import { Module } from '@nestjs/common';
import { V1Routes } from './v1.routes';
import { RouterModule } from 'nest-router';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthorizationModule } from './modules/authorizaation/authorization.module';
import { ErrorModule } from './modules/error/error.module';

@Module({
  imports: [
    RouterModule.forRoutes([V1Routes]),
    UserModule,
    AuthenticationModule,
    AuthorizationModule,
    ErrorModule,
  ],
})
export class V1Module {}
