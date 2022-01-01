import { IsOptional, IsNotEmpty } from 'class-validator';
import { FileMetaDto } from './file-meta.dto';
import { FileDto } from './file.dto';
import { FileResource } from '../enum/file-resource.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NestedFileDto extends FileDto {
  @ApiProperty({ readOnly: false, example: '6155539c6d13a68972afb4f0' })
  @Expose()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  type!: string;

  @IsOptional()
  bucketName: string;

  @IsOptional()
  s3Name: string;

  @IsOptional()
  fileName: string;

  @IsOptional()
  meta: FileMetaDto;

  @IsOptional()
  resource: FileResource;

  @IsOptional()
  resourceId: string;
}
