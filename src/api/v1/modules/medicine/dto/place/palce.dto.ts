import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlaceDto {
  @ApiProperty({ description: 'room', example: 'room1' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  room: string;

  @ApiProperty({ example: 'J' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  shelf: string;

  @ApiProperty({ example: '12' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  column: string;
}
