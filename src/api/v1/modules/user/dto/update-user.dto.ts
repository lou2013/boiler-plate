import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { UserDto } from './user.dto';
import { UserConfigDto } from './user-config.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends UserDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  username!: string;

  @IsOptional()
  firstName!: string;

  @IsOptional()
  lastName!: string;

  @IsOptional()
  gender!: Gender;

  @IsOptional()
  avatarId!: string;

  @IsOptional()
  rolesId!: string[];

  @IsOptional()
  birthDate!: Date;

  @IsOptional()
  phoneNumber!: string;

  @Exclude()
  @ApiProperty({ readOnly: true })
  password: string;

  @IsOptional()
  membership!: string[];

  @IsOptional()
  bio!: string;

  @IsOptional()
  cards!: string[];

  @IsOptional()
  notifications!: string[];

  @IsOptional()
  config: UserConfigDto;
}
