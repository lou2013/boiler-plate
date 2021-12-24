import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

export class Customer extends MongoBaseModel {
  @Prop({})
  fullName!: string;

  @Prop({ unique: true })
  phoneNumber!: string;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
