import { UserConfigCalendar } from '../enum/user-config-calender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserConfigLocale } from '../enum/user-config-locale.enum';

export class UserConfigDto {
  @ApiProperty({
    enum: UserConfigCalendar,
    enumName: 'UserConfigCalendar',
    required: true,
    example: UserConfigCalendar.GREGORIAN,
  })
  @IsEnum(UserConfigCalendar)
  @IsOptional()
  @Expose()
  calendar: UserConfigCalendar;

  @ApiProperty({
    enum: UserConfigLocale,
    enumName: 'UserConfigLocale',
    required: true,
    example: UserConfigLocale.EN,
  })
  @IsEnum(UserConfigLocale)
  @IsOptional()
  @Expose()
  locale: UserConfigLocale;
}
