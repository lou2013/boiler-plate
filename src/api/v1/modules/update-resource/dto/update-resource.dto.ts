import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { Expose } from 'class-transformer';

export class UpdateResourceDto extends MongoBaseDto {
  @Expose()
  data: Record<string, unknown>;

  @Expose()
  action: string;

  @Expose()
  resourceId: string;

  @Expose()
  resource: string;

  @Expose()
  message: string;

  @Expose()
  time: Date;

  @Expose()
  room: string;

  constructor(partial: Partial<UpdateResourceDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
