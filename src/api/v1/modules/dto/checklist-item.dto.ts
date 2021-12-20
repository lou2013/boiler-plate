import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsMongoId, ValidateNested, IsEnum } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';
import { NestedDueDateDto } from './nested-due-date.dto';
import { ChecklistItemStatus } from '../enum/checklist-item-status.enum';

export class ChecklistItemDto extends MongoBaseDto {
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
    example: '6155539c6d13a68972afb4f0',
  })
  @IsMongoId()
  member!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: NestedDueDateDto,
  })
  @Type(() => NestedDueDateDto)
  @ValidateNested()
  dueDate!: NestedDueDateDto;

  @Expose()
  @ApiProperty({
    required: true,
    enum: ChecklistItemStatus,
    example: ChecklistItemStatus.CHECKED,
  })
  @IsEnum(ChecklistItemStatus)
  status!: ChecklistItemStatus;

  constructor(partial: Partial<ChecklistItemDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
