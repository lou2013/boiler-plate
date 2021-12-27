import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { Collection } from 'src/common/enums/collection.enum';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';
import { PlaceSchema, Place } from './place.entity';

@Schema({ collection: Collection.MEDICINE })
export class Medicine extends MongoBaseModel {
  @Prop({ unique: true, type: String })
  name: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String })
  type: string;

  @Prop({ type: Number })
  count: number;

  @Prop({ type: PlaceSchema })
  place: Place;

  @Prop({ type: [Types.ObjectId], ref: Collection.SHIPMENT, default: [] })
  shipmentIds: ObjectId[];
}
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
