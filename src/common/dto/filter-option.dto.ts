import { Expose } from 'class-transformer';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { FilterOperationEnum } from '../enums/filter-operation.enum';

export class FilterOptionDto {
  @IsDefined()
  @IsString()
  @Expose()
  field: string;

  @IsDefined()
  @IsEnum(FilterOperationEnum)
  @Expose()
  operation: FilterOperationEnum;

  @IsDefined()
  @Expose()
  value: number | string | Date | number[] | string[] | boolean;

  constructor(partial: Partial<FilterOptionDto>) {
    Object.assign(this, partial);
  }
}
