import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyLookupDto {
  @ApiProperty({
    description: 'the receptor of the message',
    example: '09360073032',
  })
  @IsPhoneNumber('IR')
  receptor: string;

  @ApiProperty({
    description:
      'the first token in the message if not sent sever will generate a 4 digit one and send it ',
    example: '1231',
    required: false,
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    description:
      'the token10 or title in the message in the message not sent it is set as organ name',
    example: 'zoodex',
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @ApiProperty({
    description: 'this option is used to make the redis delete the key',
    example: true,
  })
  forceDelete?: boolean;
}
