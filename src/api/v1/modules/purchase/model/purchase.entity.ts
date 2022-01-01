import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Types } from 'mongoose';
import { Collection } from 'src/common/enums/collection.enum';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';
import { PurchaseItem, PurchaseItemSchema } from './purchase-item.entity';

@Schema({ collection: Collection.PURCHASE })
export class Purchase extends MongoBaseModel {
  @Prop({ type: [PurchaseItemSchema] })
  purchaseItems: PurchaseItem[];

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({ type: String })
  receipt: string;

  @Prop({ type: Types.ObjectId, ref: Collection.CUSTOMER })
  customerId: ObjectId;
}
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
