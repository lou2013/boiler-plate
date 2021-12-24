import { SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

export class Customer extends MongoBaseModel {}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
