import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';

export class CustomFieldValueDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '6155539c6d13a68972afb4f0',
  })
  @IsMongoId()
  fieldId!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'asdf',
  })
  @IsString()
  value!: string;

  constructor(partial: Partial<CustomFieldValueDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
