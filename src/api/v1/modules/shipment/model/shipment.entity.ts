import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from 'src/common/enums/collection.enum';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';
import { Item, ItemSchema } from './item.entity';

@Schema({ collection: Collection.SHIPMENT })
export class Shipment extends MongoBaseModel {
  @Prop({ type: [ItemSchema] })
  items: Item[];
}
export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
