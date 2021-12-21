import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { LoginMethods } from '../enum/login-methods.enum';
import { LoginOrigins } from '../enum/login-origins.enum';

export class LoginMethodDto {
  @Expose()
  @IsEnum(LoginMethods)
  @ApiProperty({
    enum: LoginMethods,
    required: true,
    example: LoginMethods.SMS,
  })
  method: LoginMethods;

  @ValidateIf((obj) => !obj.code && obj.method === LoginMethods.SMS)
  @IsPhoneNumber('IR')
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: '09030746746',
  })
  phoneNumber?: string;

  @ValidateIf((obj) => !obj.phoneNumber && obj.method === LoginMethods.SMS)
  @IsString()
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: '12345',
  })
  code?: string;

  @ValidateIf((obj) => obj.code && obj.method === LoginMethods.SMS)
  @IsString()
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.eyJwaG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge',
  })
  validateToken?: string;

  @ValidateIf(
    (obj) => !obj.phoneNumber && !obj.code && obj.method === LoginMethods.TOKEN,
  )
  @IsString()
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.eyJwaG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge',
  })
  token?: string;

  @ValidateIf((obj) => obj.token)
  @IsEnum(LoginOrigins)
  @Expose()
  @ApiProperty({
    enum: LoginOrigins,
    required: true,
    example: LoginOrigins.GOOGLE,
  })
  origin?: LoginOrigins;
}
