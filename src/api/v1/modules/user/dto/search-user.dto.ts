import { Exclude, Expose } from 'class-transformer';
import { Gender } from '../enum/gender.enum';
import { UserDto } from './user.dto';
import { NestedRoleDto } from '../../authorizaation/dto/nested-role.dto';

export class SearchedUserDto extends UserDto {
  @Expose({})
  id: string;

  @Expose()
  username!: string;

  @Expose()
  fullName!: string;

  @Exclude()
  gender!: Gender;

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
  updatedBy: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
