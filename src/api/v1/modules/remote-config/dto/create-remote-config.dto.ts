import { Expose } from 'class-transformer';
import { RemoteConfigDto } from './remote-config.dto';

export class CreateRemoteConfigDto extends RemoteConfigDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
