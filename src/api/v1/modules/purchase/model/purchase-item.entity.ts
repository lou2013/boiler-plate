import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

@Schema({ _id: false, versionKey: false })
export class PurchaseItem extends MongoBaseModel {
  @Prop({ type: Types.ObjectId, ref: 'medicine' })
  medicineId: ObjectId;

  @Prop({ type: Number })
  count: number;
}

export const PurchaseItemSchema = SchemaFactory.createForClass(PurchaseItem);
