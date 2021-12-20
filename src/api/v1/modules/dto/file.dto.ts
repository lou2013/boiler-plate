import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class FileDto {
  @Expose()
  @ApiProperty({
    maxLength: 30,
    required: true,
    type: String,
    example: 'Walsh',
  })
  @IsString()
  @MaxLength(30)
  type!: string;
}
