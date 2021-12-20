import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DueDateDto } from './due-date.dto';

export class NestedDueDateDto extends DueDateDto {
  @IsOptional()
  start!: Date;

  @IsOptional()
  target!: Date;

  @IsOptional()
  end!: Date;
}
