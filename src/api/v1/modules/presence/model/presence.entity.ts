import { Prop, SchemaFactory } from '@nestjs/mongoose';
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
export const PresenceSchema = SchemaFactory.createForClass(Presence);
PresenceSchema.index({ date: 1, userId: 1 }, { unique: true });
