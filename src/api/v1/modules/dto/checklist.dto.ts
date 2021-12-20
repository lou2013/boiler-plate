import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';
import { NestedChecklistItemDto } from './nested-checklist-item.dto';

export class ChecklistDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'qweeqwe',
  })
  @IsString()
  name!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: [NestedChecklistItemDto],
  })
  @Type(() => NestedChecklistItemDto)
  items!: NestedChecklistItemDto[];

  constructor(partial: Partial<ChecklistDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
