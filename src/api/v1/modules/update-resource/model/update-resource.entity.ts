import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { Collection } from '../../../../../common/enums/collection.enum';

@Schema({ collection: Collection.UPDATE_RESOURCE })
export class UpdateResource extends MongoBaseModel {
  @Prop({ type: Object })
  data: Record<string, unknown>;

  @Prop({})
  action: string;

  @Prop({})
  resourceId: string;

  @Prop({})
  resource: string;

  @Prop({})
  message: string;

  @Prop({})
  time: Date;

  @Prop({})
  room: string;
}

export const UpdateResourceSchema =
  SchemaFactory.createForClass(UpdateResource);
