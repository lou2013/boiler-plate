import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CustomFieldDto } from './custom-field.dto';
import { ValidateNested } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';

export class CustomFormDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'qweqweqw',
  })
  name!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: [CustomFieldDto],
  })
  @Type(() => CustomFieldDto)
  @ValidateNested({ each: true })
  fields!: CustomFieldDto[];

  constructor(partial: Partial<CustomFormDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
