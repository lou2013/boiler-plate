import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class PurchaseItem {
  @Prop({ type: Types.ObjectId, ref: 'medicine' })
  medicineId: ObjectId;

  @Prop({ type: Number })
  count: number;
}

export const PurchaseItemSchema = SchemaFactory.createForClass(PurchaseItem);
