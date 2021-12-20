import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { IsObject, IsString } from 'class-validator';

export class RemoteConfigDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({ type: String, required: true, example: 'key' })
  @IsString()
  key: string;

  @Expose()
  @ApiProperty({ type: String, required: true, example: 'description' })
  @IsString()
  description: string;

  @Expose()
  @ApiProperty({ type: {}, required: true, example: 'description' })
  @IsObject()
  data: Record<string, unknown>;

  constructor(partial: Partial<RemoteConfigDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
