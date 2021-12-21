import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NestedUserDto extends UserDto {
  @ApiProperty({ readOnly: false, example: '6155539c6d13a68972afb4f0' })
  @Expose()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  username!: string;

  @IsOptional()
  fullName!: string;

  @IsOptional()
  gender!: Gender;

  @IsOptional()
  birthDate!: Date;

  @IsOptional()
  phoneNumber!: string;

  @IsOptional()
  password: string;
}
