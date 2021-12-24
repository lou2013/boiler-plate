import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { Collection } from '../../../../../common/enums/collection.enum';

@Schema({ collection: Collection.ROLE })
export class Role extends MongoBaseModel {
  @Prop({
    type: String,
    allowNull: false,
    unique: true,
  })
  title!: string;

  @Prop({ type: String, default: '*' })
  domain!: string;

  @Prop({ type: [Types.ObjectId], ref: Collection.PERMISSION, default: [] })
  permissionIds: string[];
}
export const RoleSchema = SchemaFactory.createForClass(Role);
