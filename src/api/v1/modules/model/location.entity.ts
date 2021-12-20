import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../common/models/mongo-base-model.entity';

@Schema({ collection: Collection.LOCATION })
export class Location extends MongoBaseModel {
  @Prop({})
  latitude!: string;

  @Prop({})
  longitude!: string;

  @Prop({})
  address!: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
