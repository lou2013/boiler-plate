import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../common/enums/collection.enum';
import { CustomFieldType } from '../enum/custom-field-type.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.CUSTOM_FIELD })
export class CustomField extends MongoBaseModel {
  @Prop({})
  color!: string;

  @Prop({})
  type!: CustomFieldType;

  @Prop({})
  values!: string[];
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);
