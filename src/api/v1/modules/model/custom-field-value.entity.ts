import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Collection } from '../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.CUSTOM_FIELD_VALUE })
export class CustomFieldValue extends MongoBaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: Collection.CUSTOM_FIELD,
  })
  fieldId: string;

  @Prop({})
  value: string;
}

export const CustomFieldValueSchema =
  SchemaFactory.createForClass(CustomFieldValue);
