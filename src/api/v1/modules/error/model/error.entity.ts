import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { Collection } from '../../../../../common/enums/collection.enum';

@Schema({ collection: Collection.ERROR })
export class Error extends MongoBaseModel {
  @Prop()
  sourceClass: string;

  @Prop()
  sourceMethod: string;

  @Prop()
  stack: string;

  @Prop()
  message: string;

  @Prop()
  status: number;
}

export const ErrorSchema = SchemaFactory.createForClass(Error);
