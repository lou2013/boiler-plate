import { SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

export class Medicine extends MongoBaseModel {}
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
