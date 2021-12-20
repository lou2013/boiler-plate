import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetRemoteConfigByKeyQuery {
  @Expose()
  @ApiProperty({ required: false })
  @IsString()
  key: string;
}
