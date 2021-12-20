import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsHexColor } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';

export class LabelDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'qweeqwe',
  })
  @IsString()
  title!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '000000',
  })
  @IsHexColor()
  color!: string;
}
