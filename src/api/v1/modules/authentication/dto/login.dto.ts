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
}
