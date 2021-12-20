import { Exclude, Expose } from 'class-transformer';
import { Gender } from '../enum/gender.enum';
import { UserDto } from './user.dto';
import { UserConfigDto } from './user-config.dto';
import { NestedRoleDto } from '../../authorizaation/dto/nested-role.dto';
import { UserStatus } from '../enum/user-status.enum';

export class SearchedUserDto extends UserDto {
  @Expose({})
  id: string;

  @Expose()
  username!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Exclude()
  status: UserStatus;

  @Exclude()
  gender!: Gender;

  @Expose()
  avatarId!: string;

  @Exclude()
  roles: NestedRoleDto[];

  @Exclude()
  rolesId!: string[];

  @Exclude()
  birthDate!: Date;

  @Exclude()
  phoneNumber!: string;

  @Exclude()
  password: string;

  @Exclude()
  membership!: string[];

  @Exclude()
  bio!: string;

  @Exclude()
  cards!: string[];

  @Exclude()
  notifications!: string[];

  @Exclude()
  fcmTokens: string[];

  @Exclude()
  updatedBy: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  config: UserConfigDto;
}
