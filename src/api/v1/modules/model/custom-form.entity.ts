import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CustomField, CustomFieldSchema } from './custom-field.entity';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';
import { Collection } from '../../../../common/enums/collection.enum';

@Schema({ collection: Collection.CUSTOM_FORM })
export class CustomForm extends MongoBaseModel {
  @Prop({})
  name!: string;

  @Prop({ type: [CustomFieldSchema] })
  fields!: CustomField[];
}

export const CustomFormSchema = SchemaFactory.createForClass(CustomForm);
