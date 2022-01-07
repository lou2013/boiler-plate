import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileMetaDto {
  @Expose({})
  @ApiProperty({
    type: Number,
    example: 4,
  })
  size: number;

  constructor(partial: Partial<FileMetaDto>) {
    Object.assign(this, partial);
  }
}
