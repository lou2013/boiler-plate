import { Expose } from 'class-transformer';
import { PresenceDto } from './presence.dto';

export class CreatePresenceDto extends PresenceDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @Expose({ toPlainOnly: true })
  userId: string;
}
