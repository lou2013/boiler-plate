import { SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

export class Shipment extends MongoBaseModel {}
export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
