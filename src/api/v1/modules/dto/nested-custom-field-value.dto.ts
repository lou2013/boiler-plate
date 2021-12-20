import { IsOptional } from 'class-validator';
import { CustomFieldValueDto } from './custom-field-value.dto';

export class NestedCustomFieldValueDto extends CustomFieldValueDto {
  @IsOptional()
  fieldId!: string;

  @IsOptional()
  value!: string;
}
