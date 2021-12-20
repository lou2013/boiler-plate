import { ApiProperty } from '@nestjs/swagger';

export class VerifyLookUpOutputDto {
  @ApiProperty({
    description:
      'if the sms was sent is true otherwise its false it only works in verify lookUp',
    example: true,
  })
  sent: boolean;

  @ApiProperty({
    description:
      'the password that was sent or automatically generated by the system the password is 4 digits',
    example: '1111',
  })
  password: string;

  constructor(partial: Partial<VerifyLookUpOutputDto>) {
    Object.assign(this, partial);
  }
}
