import { Expose, Exclude } from 'class-transformer';
import {
  IsOptional,
  ValidateIf,
  IsString,
  IsMobilePhone,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Gender } from '../../user/enum/gender.enum';

export class SignupDto {
  @ValidateIf((obj) => !obj.code)
  @Expose()
  @MaxLength(30)
  @IsString()
  @ApiProperty({
    maxLength: 30,
    required: true,
    type: String,
    example: 'Walsh',
  })
  username!: string;

  @ValidateIf((obj) => !obj.code)
  @Expose()
  @MaxLength(30)
  @IsString()
  @ApiProperty({
    maxLength: 30,
    required: true,
    type: String,
    example: 'Walsh',
  })
  firstName!: string;

  @ValidateIf((obj) => !obj.code)
  @Expose()
  @MaxLength(30)
  @IsString()
  @ApiProperty({
    maxLength: 30,
    required: true,
    type: String,
    example: 'Aurore',
  })
  lastName!: string;

  @ValidateIf((obj) => !obj.code)
  @IsEnum(Gender)
  @Expose()
  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    required: true,
    example: Gender.MALE,
  })
  gender: Gender;

  @IsMobilePhone('fa-IR')
  @Expose()
  @ValidateIf((obj) => !obj.code)
  @ApiProperty({
    type: String,
    required: true,
    example: '09123456789',
  })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
    example: 'qwertyuiop',
  })
  @MinLength(8)
  @MaxLength(64)
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    example: '12345',
  })
  code: string;

  @ValidateIf((obj) => obj.code)
  @IsString()
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.eyJwaG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge',
  })
  validateToken?: string;
}
