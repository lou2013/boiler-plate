import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Collection } from 'src/common/enums/collection.enum';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Item {
  @Prop({ type: Types.ObjectId, ref: Collection.MEDICINE })
  medicineId: string;

  @Prop({ type: Number })
  count: number;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
