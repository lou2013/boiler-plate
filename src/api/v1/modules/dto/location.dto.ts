import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';

export class LocationDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'asdf',
  })
  @IsString()
  latitude!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'asdf',
  })
  @IsString()
  longitude!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'asdf',
  })
  @IsString()
  address!: string;

  constructor(partial: Partial<LocationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
