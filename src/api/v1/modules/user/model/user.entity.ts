import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Gender } from '../enum/gender.enum';
import { Collection } from '../../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { defaultIds } from '../../../../../constants/default-ids';

@Schema({ collection: Collection.USER })
export class User extends MongoBaseModel {
  @Prop({ unique: true })
  username!: string;

  @Prop({})
  fullName!: string;

  @Prop({})
  gender: Gender;

  @Prop({})
  birthDate: Date;

  @Prop({ unique: true })
  phoneNumber!: string;

  @Prop({})
  password: string;

  @Prop({
    type: [Types.ObjectId],
    ref: Collection.ROLE,
    default: [new Types.ObjectId(defaultIds.defaultRole)],
  })
  rolesId!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function () {
  if (!this.ownerId || this.ownerId === '') this.ownerId = this._id;
});
