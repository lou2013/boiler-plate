import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsHexColor, IsString } from 'class-validator';
import { CustomFieldType } from '../enum/custom-field-type.enum';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';

export class CustomFieldDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '000000',
  })
  @IsHexColor()
  color!: string;

  @Expose()
  @ApiProperty({
    required: true,
    enum: CustomFieldType,
  })
  @IsEnum(CustomFieldType)
  type!: CustomFieldType;

  @Expose()
  @ApiProperty({
    required: true,
    type: [String],
  })
  @IsString({ each: true })
  values!: string[];

  constructor(partial: Partial<CustomFieldDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
