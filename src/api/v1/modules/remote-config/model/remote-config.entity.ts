import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { Collection } from '../../../../../common/enums/collection.enum';

@Schema({ collection: Collection.REMOTE_CONFIG })
export class RemoteConfig extends MongoBaseModel {
  @Prop({})
  key: string;

  @Prop({})
  description: string;

  @Prop({ type: Object })
  data: Record<string, unknown>;
}

export const RemoteConfigSchema = SchemaFactory.createForClass(RemoteConfig);
