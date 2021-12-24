import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from 'src/common/models/mongo-base-model.entity';

@Schema({ _id: false, versionKey: false })
export class Place extends MongoBaseModel {
  @Prop({ type: String })
  room: string;

  @Prop({ type: String })
  shelf: string;

  @Prop({ type: String })
  column: string;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
