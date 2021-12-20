import { V1Module } from './v1.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ErrorModule } from './modules/error/error.module';
import { UpdateResourceModule } from './modules/update-resource/update-resource.module';
import { RemoteConfigModule } from './modules/remote-config/remote-config.module';

export const V1Routes = {
  path: '/v1',
  module: V1Module,
  children: [
    { path: '/remote-config', module: RemoteConfigModule },
    { path: '/update-resource', module: UpdateResourceModule },
    { path: '/error', module: ErrorModule },
    { path: '/auth', module: AuthenticationModule },
    {
      path: '/user',
      module: UserModule,
    },
  ],
};
