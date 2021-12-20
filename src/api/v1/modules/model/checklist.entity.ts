import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CheckListItem, CheckListItemSchema } from './checklsit-item.entity';
import { Collection } from '../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.CHECK_LIST })
export class CheckList extends MongoBaseModel {
  @Prop({})
  name!: string;

  @Prop({ type: [CheckListItemSchema] })
  items!: CheckListItem[];
}

export const CheckListSchema = SchemaFactory.createForClass(CheckList);
