import { Document, Types } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { Collection } from '../enums/collection.enum';

@Schema()
export abstract class MongoBaseModel extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Collection.USER,
  })
  ownerId: string;

  @Prop({
    type: Types.ObjectId,
    ref: Collection.USER,
  })
  updatedBy: string;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}
