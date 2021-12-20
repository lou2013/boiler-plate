import { IsOptional } from 'class-validator';
import { ChecklistDto } from './checklist.dto';
import { NestedChecklistItemDto } from './nested-checklist-item.dto';

export class NestedChecklistDto extends ChecklistDto {
  @IsOptional()
  name!: string;

  @IsOptional()
  items!: NestedChecklistItemDto[];
}
