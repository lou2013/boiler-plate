import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Place {
  @Prop({ type: String })
  room: string;

  @Prop({ type: String })
  shelf: string;

  @Prop({ type: String })
  column: string;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
