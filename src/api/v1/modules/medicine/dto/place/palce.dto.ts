import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlaceDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  room: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  shelf: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  column: string;
}
