import { Action } from '../../../../../common/enums/action.enum';
import { PermissionLevel } from '../enum/permission-level.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Collection } from '../../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { Resource } from '../../../../../common/enums/resource.enum';

@Schema({ collection: Collection.PERMISSION })
export default class Permission extends MongoBaseModel {
  @Prop({ enum: Resource })
  resource!: Resource;

  @Prop({ enum: Action })
  action!: Action;

  @Prop({ enum: PermissionLevel })
  level!: PermissionLevel;

  @Prop({ type: [Types.ObjectId], ref: Collection.ROLE })
  roles: string[];
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
