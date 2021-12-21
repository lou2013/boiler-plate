import { V1Module } from './v1.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ErrorModule } from './modules/error/error.module';

export const V1Routes = {
  path: '/v1',
  module: V1Module,
  children: [
    { path: '/error', module: ErrorModule },
    { path: '/auth', module: AuthenticationModule },
    {
      path: '/user',
      module: UserModule,
    },
  ],
};
