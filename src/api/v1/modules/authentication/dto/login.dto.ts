import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsMobilePhone, IsOptional, IsString } from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '09030746746',
  })
  @IsMobilePhone('fa-IR')
  @Expose()
  phoneNumber!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'qwertyuiop',
  })
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.eyJwaG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge',
  })
  fcmToken?: string;
}
