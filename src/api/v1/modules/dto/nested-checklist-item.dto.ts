import { IsOptional } from 'class-validator';
import { NestedDueDateDto } from './nested-due-date.dto';
import { ChecklistItemStatus } from '../enum/checklist-item-status.enum';
import { ChecklistItemDto } from './checklist-item.dto';

export class NestedChecklistItemDto extends ChecklistItemDto {
  @IsOptional()
  title!: string;

  @IsOptional()
  member!: string;

  @IsOptional()
  dueDate!: NestedDueDateDto;

  @IsOptional()
  status!: ChecklistItemStatus;
}
