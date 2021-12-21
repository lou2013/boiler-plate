import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends UserDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  username!: string;

  @IsOptional()
  fullName!: string;

  @IsOptional()
  gender!: Gender;

  @IsOptional()
  rolesId!: string[];

  @IsOptional()
  birthDate!: Date;

  @IsOptional()
  phoneNumber!: string;

  @Exclude()
  @ApiProperty({ readOnly: true })
  password: string;
}
