import { Expose } from 'class-transformer';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';

export class PresenceDto extends MongoBaseDto {
  @Expose()
  enterTime: Date;

  @Expose()
  exitTime: Date;

  @Expose()
  date: string;

  @Expose()
  userId: string;
}
