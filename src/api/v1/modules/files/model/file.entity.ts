import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../../common/enums/collection.enum';
import { FileMetaDto } from '../dto/file-meta.dto';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';
import { FileResource } from '../enum/file-resource.enum';

@Schema({ collection: Collection.FILE })
export class File extends MongoBaseModel {
  @Prop({})
  type!: string;

  @Prop({})
  bucketName: string;

  @Prop({})
  s3Name: string;

  @Prop({})
  fileName: string;

  @Prop({})
  meta: FileMetaDto;

  @Prop({})
  resources: {
    resource: FileResource;
    resourceId: string;
  }[];
}

export const FileSchema = SchemaFactory.createForClass(File);
