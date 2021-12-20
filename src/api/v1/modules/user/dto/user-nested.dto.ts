import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserConfigDto } from './user-config.dto';

export class NestedUserDto extends UserDto {
  @ApiProperty({ readOnly: false, example: '6155539c6d13a68972afb4f0' })
  @Expose()
  @IsNotEmpty()
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
  birthDate!: Date;

  @IsOptional()
  phoneNumber!: string;

  @IsOptional()
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
