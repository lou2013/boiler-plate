import { Module, Logger } from '@nestjs/common';
import { NotifyGateway } from './gateway/notify.gateway';
import { UserModule } from '../../api/v1/modules/user/user.module';
import { UpdateResourceModule } from '../../api/v1/modules/update-resource/update-resource.module';

@Module({
  imports: [UserModule, UpdateResourceModule],
  controllers: [],
  providers: [Logger, NotifyGateway],
  exports: [],
})
export class NotifyModule {}
