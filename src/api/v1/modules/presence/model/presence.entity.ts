import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

export class Presence extends MongoBaseModel {
  @Prop({ type: Date })
  enterTime: Date;

  @Prop({ type: Date })
  exitTime: Date;

  @Prop({ type: String })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: string;
}
