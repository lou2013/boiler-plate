import { SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

export class Purchase extends MongoBaseModel {}
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
