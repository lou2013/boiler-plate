import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Collection } from 'src/common/enums/collection.enum';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

@Schema({ versionKey: false, collection: Collection.CUSTOMER })
export class Customer extends MongoBaseModel {
  @Prop({})
  fullName!: string;

  @Prop({ unique: true })
  phoneNumber!: string;

  @Prop({ type: [Types.ObjectId], ref: Collection.PURCHASE, default: [] })
  purchaseIds: string[];
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
