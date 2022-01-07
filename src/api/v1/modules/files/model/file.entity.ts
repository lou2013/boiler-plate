import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from '../../../../../common/enums/collection.enum';
import { FileMetaDto } from '../dto/file-meta.dto';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';

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
  hashKey: string;

  @Prop({})
  meta: FileMetaDto;
}

export const FileSchema = SchemaFactory.createForClass(File);
