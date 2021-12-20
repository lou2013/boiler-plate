import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DueDateSchema, DueDate } from './due-date.entity';
import { ChecklistItemStatus } from '../enum/checklist-item-status.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';
import { Collection } from '../../../../common/enums/collection.enum';

@Schema({ collection: 'CheckListItem' })
export class CheckListItem extends MongoBaseModel {
  @Prop({})
  title!: string;

  @Prop({
    type: Types.ObjectId,
    ref: Collection.USER,
  })
  member!: string;

  @Prop({
    type: DueDateSchema,
  })
  dueDate!: DueDate;

  @Prop({ default: ChecklistItemStatus.CHECKED })
  status!: ChecklistItemStatus;
}

export const CheckListItemSchema = SchemaFactory.createForClass(CheckListItem);
