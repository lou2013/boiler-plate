import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.LABEL })
export class Label extends MongoBaseModel {
  @Prop({})
  color!: string;

  @Prop({})
  title!: string;
}

export const LabelSchema = SchemaFactory.createForClass(Label);
