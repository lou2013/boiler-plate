import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetFileQueryDto {
  @Expose({})
  @ApiProperty({
    type: String,
    example: 'wedrfgthjklkjhngbfdfghjkl;lkjhgfdsdfghjkl',
  })
  @IsString()
  hashKey: string;
}
