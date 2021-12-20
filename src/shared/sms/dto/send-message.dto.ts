import { IsArray, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendMessageDto {
  constructor(sendSmsDto: SendMessageDto) {
    Object.assign(this, sendSmsDto);
  }

  @IsArray()
  @IsString({ each: true })
  @IsPhoneNumber('IR', { each: true })
  @IsNotEmpty({ each: true })
  receptor!: string[];

  @IsString()
  @IsNotEmpty()
  message!: string;
}
