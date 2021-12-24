import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PresenceDto } from './presence.dto';

export class UpdatePresenceDto extends PresenceDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  enterTime: Date;

  @IsOptional()
  exitTime: Date;

  @IsOptional()
  date: string;

  @Expose({ toPlainOnly: true })
  userId: string;
}
