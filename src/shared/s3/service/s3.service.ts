import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketItemStat, Client } from 'minio';
import { contentType } from 'mime-types';
import { S3 } from '../../../common/enums/s3.enum';
import { AppConfigs } from '../../../constants/app.configs';
import { s3Config } from '../../../common/config/s3.config';

@Injectable()
export class S3Service {
  constructor(
    @Inject('S3_NAME') s3Name: S3,
    readonly configService: ConfigService,
  ) {
    this.s3Name = s3Name;
    this.s3 = configService.get<s3Config>(AppConfigs[s3Name]);
    this.minIoClient = new Client({
      accessKey: this.s3.accessKey,
      endPoint: this.s3.endpoint,
      secretKey: this.s3.privateKey,
      useSSL: true,
    });
  }

  private s3Name: S3;

  private s3: s3Config;

  private minIoClient: Client;

  async uploadMedia({ record, data }: { record: string; data: any }) {
    try {
      const { bucketName } = this.s3;
      if (!contentType(record))
        throw new UnprocessableEntityException(
          'file extension was not in any content types',
        );
      const uploadedFile = await this.minIoClient.putObject(
        bucketName,
        record,
        data,
        {
          'Content-Type': contentType(record),
        },
      );
      return { uploadedFile, bucketName, s3Name: this.s3Name };
    } catch (error) {
      throw error;
    }
  }

  async getObject({ key }: { key: string }) {
    const { bucketName } = this.s3;

    try {
      return await this.minIoClient.getObject(bucketName, key);
    } catch (error) {
      if (error.code === 'NoSuchKey')
        throw new NotFoundException('Object not found');
      throw error;
    }
  }

  async getObjectRange({
    key,
    range,
  }: {
    key: string;
    range: { start: number; end: number };
  }) {
    const { bucketName } = this.s3;
    const { start, end } = range;
    try {
      return await this.minIoClient.getPartialObject(
        bucketName,
        key,
        start,
        end - start + 1,
      );
    } catch (error) {
      if (error.code === 'NotFound')
        throw new NotFoundException('Object not found');
      throw error;
    }
  }

  async getObjectStats({ key }: { key: string }): Promise<BucketItemStat> {
    const { bucketName } = this.s3;
    try {
      return await this.minIoClient.statObject(bucketName, key);
    } catch (error) {
      if (error.code === 'NotFound')
        throw new NotFoundException('Object not found');
      throw error;
    }
  }
}
