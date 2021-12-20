import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { changePhoneNumberStep } from '../enum/change-phone-number-step.enum';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ChangePhoneNumberDto {
  @ValidateIf((obj) => !obj.code)
  @ApiProperty({ description: 'the new PhoneNumber', example: '09360072022' })
  @Expose()
  @IsPhoneNumber('IR')
  newPhoneNumber?: string;

  @ApiProperty({
    description: 'the code sent to the old phoneNumber',
    example: '1111',
  })
  @IsOptional()
  @IsString()
  @Expose()
  code?: string;

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

  @Expose()
  @ValidateIf((obj) => obj.code)
  @ApiProperty({
    enum: changePhoneNumberStep,
    required: true,
    example: changePhoneNumberStep.OLD,
  })
  @IsEnum(changePhoneNumberStep)
  step?: changePhoneNumberStep;
}
