import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { FileResource } from '../enum/file-resource.enum';
import { IsOptional } from 'class-validator';
import { FileMetaDto } from './file-meta.dto';

export class FileDto extends MongoBaseDto {
  @Expose({ toPlainOnly: true })
  @ApiProperty({
    type: String,
    example: 'image/jpeg',
    readOnly: true,
  })
  @IsOptional()
  type!: string;

  @Expose({ toPlainOnly: true })
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'bucket name',
    readOnly: true,
  })
  bucketName: string;

  @Expose({ toPlainOnly: true })
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 's3 name',
    readOnly: true,
  })
  s3Name: string;

  @Expose({ toPlainOnly: true })
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'file Name',
    readOnly: true,
  })
  fileName: string;

  @Expose({ toPlainOnly: true })
  @IsOptional()
  @ApiProperty({
    type: FileMetaDto,
    readOnly: true,
  })
  @Type(() => FileMetaDto)
  meta: FileMetaDto;

  @Expose({ toPlainOnly: true })
  @ApiProperty({
    readOnly: true,
  })
  resources: {
    resource: FileResource;
    resourceId: string;
  }[];

  constructor(partial: Partial<FileDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
