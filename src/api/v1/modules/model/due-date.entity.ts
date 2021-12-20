import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.DUE_DATE })
export class DueDate extends MongoBaseModel {
  @Prop({})
  start!: Date;

  @Prop({})
  target!: Date;

  @Prop({})
  end!: Date;
}

export const DueDateSchema = SchemaFactory.createForClass(DueDate);
