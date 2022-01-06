import {
  Injectable,
  Inject,
  Logger,
  LoggerService,
  StreamableFile,
} from '@nestjs/common';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';
import { File } from '../model/file.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { FileDto } from '../dto/file.dto';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { S3Service } from '../../../../../shared/s3/service/s3.service';
import { UserDto } from '../../user/dto/user.dto';
import { FileMetaDto } from '../dto/file-meta.dto';
import { FilterOptionDto } from '../../../../../common/dto/filter-option.dto';
import { FilterOperationEnum } from '../../../../../common/enums/filter-operation.enum';
import { genSalt, hash } from 'bcrypt';
import { FileResource } from '../enum/file-resource.enum';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
// this service extends the base service of mongo tool and the model and dto is passed to base service it is used for saving the files
// the file information are saved in our database while the file itself is saved in the s3 bucket
// saving the file is used through s3 service

@Injectable()
export class FileService extends MongoBaseService<
  File,
  FileDto,
  CreateFileDto,
  UpdateFileDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(File.name)
    readonly fileModel: PaginateModel<File>,
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super(fileModel, FileDto, logger);
  }

  async getFile(hashKey: string, res: Response): Promise<StreamableFile> {
    const file = await super.findOne([
      new FilterOptionDto({
        field: 'hashKey',
        operation: FilterOperationEnum.EQ,
        value: hashKey,
      }),
    ]);
    res.set({
      'Content-Type': file.type,
      // uncomment this for download file
      // 'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });
    return new StreamableFile(
      await this.s3Service.getObject({ key: file.fileName }),
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
    user: UserDto,
  ): Promise<FileDto> {
    createFileDto.type = file.mimetype;

    createFileDto.meta = new FileMetaDto({ size: file.size });
    createFileDto.fileName = `${Date.now()}-${file.originalname}`;

    const { bucketName, s3Name } = await this.s3Service.uploadMedia({
      record: createFileDto.fileName,
      data: file.buffer,
    });

    createFileDto.s3Name = s3Name;
    createFileDto.bucketName = bucketName;

    let createdFile = await super.create(createFileDto, user);
    const salt = await genSalt(10);
    const hashKey = await hash(createdFile.id, salt);

    createdFile = await super.update(
      [
        new FilterOptionDto({
          field: '_id',
          operation: FilterOperationEnum.EQ,
          value: createdFile.id,
        }),
      ],
      { hashKey },
      user,
    );
    return createdFile;
  }

  async useFile(
    hashKey: string,
    user: UserDto,
    resource: FileResource,
    resourceId: string,
  ): Promise<FileDto> {
    return await super.update(
      [
        new FilterOptionDto({
          field: 'hashKey',
          operation: FilterOperationEnum.EQ,
          value: hashKey,
        }),
      ],
      {
        $push: { resources: { resource, resourceId } },
      },
      user,
    );
  }

  async _unuseFile(
    hashKey: string,
    user: UserDto,
    resource: FileResource,
    resourceId: string,
  ): Promise<FileDto> {
    return await super.update(
      [
        new FilterOptionDto({
          field: 'hashKey',
          operation: FilterOperationEnum.EQ,
          value: hashKey,
        }),
      ],
      {
        $pull: { resources: { resource, resourceId } },
      },
      user,
    );
  }
}
