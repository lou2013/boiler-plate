import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Gender } from '../enum/gender.enum';
import { UserStatus } from '../enum/user-status.enum';
import { UserConfigDto } from '../dto/user-config.dto';
import { Collection } from '../../../../../common/enums/collection.enum';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { plainToClass } from 'class-transformer';
import { UserConfigCalendar } from '../enum/user-config-calender.enum';
import { UserConfigLocale } from '../enum/user-config-locale.enum';
import { defaultIds } from '../../../../../constants/default-ids';

@Schema({ collection: Collection.USER })
export class User extends MongoBaseModel {
  @Prop({ unique: true })
  username!: string;

  @Prop({})
  firstName!: string;

  @Prop({})
  lastName!: string;

  @Prop({})
  gender: Gender;

  @Prop({})
  birthDate: Date;

  @Prop({ default: UserStatus.PENDING })
  status!: UserStatus;

  @Prop({ unique: true })
  phoneNumber!: string;

  @Prop({})
  password: string;

  @Prop({
    type: [Types.ObjectId],
    ref: Collection.MEMBERSHIP,
  })
  memberships!: string[];

  @Prop({ type: Types.ObjectId, ref: Collection.FILE })
  avatarId?: string;

  @Prop({})
  bio: string;

  @Prop({
    type: UserConfigDto,
    default: plainToClass(UserConfigDto, {
      calendar: UserConfigCalendar.GREGORIAN,
      locale: UserConfigLocale.EN,
    }),
  })
  config: UserConfigDto;

  @Prop({
    type: [Types.ObjectId],
    ref: Collection.CARD,
  })
  cards!: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: Collection.NOTIFICATION,
  })
  notifications!: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: Collection.ROLE,
    default: [new Types.ObjectId(defaultIds.defaultRole)],
  })
  rolesId!: string[];

  @Prop({})
  fcmTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function () {
  if (!this.ownerId || this.ownerId === '') this.ownerId = this._id;
});
