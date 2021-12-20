import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {} from 'class-validator';
import { FilterOptionDto } from './filter-option.dto';

export class PaginationRequestDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsArray()
  @Expose()
  sortBy?: string[];

  @IsOptional()
  @IsNumber()
  @Max(50)
  @IsPositive()
  @ApiProperty({ default: 10, required: false })
  @Expose({ toPlainOnly: true })
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ default: 1, required: false })
  @Expose({ toPlainOnly: true })
  page?: number = 1;

  @ValidateIf(({ page }) => !page)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  @Expose({ toPlainOnly: true })
  offset?: number;

  @IsOptional()
  @ApiProperty({ type: [FilterOptionDto], required: false })
  @Transform(
    (field) => {
      try {
        return field.value.map((v) => new FilterOptionDto(JSON.parse(v)));
      } catch (error) {
        return field.value;
      }
    },
    { toClassOnly: true },
  )
  @Expose()
  @IsArray()
  @Type(() => FilterOptionDto)
  @ValidateNested({ each: true })
  filter?: FilterOptionDto[] = [];

  @IsOptional()
  @ApiProperty({ type: [FilterOptionDto], required: false })
  @Transform(
    (field) => {
      try {
        return field.value.map((v) => new FilterOptionDto(JSON.parse(v)));
      } catch (error) {
        return field.value;
      }
    },
    { toClassOnly: true },
  )
  @Expose()
  @IsArray()
  @Type(() => FilterOptionDto)
  @ValidateNested({ each: true })
  search?: FilterOptionDto[] = [];
}
