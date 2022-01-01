import { IsOptional } from 'class-validator';
import { FileMetaDto } from './file-meta.dto';
import { FileDto } from './file.dto';
import { FileResource } from '../enum/file-resource.enum';

export class UpdateFileDto extends FileDto {
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
