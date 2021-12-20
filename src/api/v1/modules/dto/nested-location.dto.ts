import { IsOptional } from 'class-validator';
import { LocationDto } from './location.dto';

export class NestedLocationDto extends LocationDto {
  @IsOptional()
  latitude!: string;

  @IsOptional()
  longitude!: string;

  @IsOptional()
  address!: string;
}
