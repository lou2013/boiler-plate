import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from './service/s3.service';
import { S3 } from '../../common/enums/s3.enum';

@Module({})
export class S3Module {
  static register(s3: S3): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'S3_NAME',
          useValue: s3,
        },
        S3Service,
      ],
      exports: [S3Service],
    };
  }
}
