import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.MESSAGE })
export class Message extends MongoBaseModel {
  @Prop({})
  type!: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
