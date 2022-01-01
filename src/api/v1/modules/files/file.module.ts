import { Logger, Module } from '@nestjs/common';
import { FileController } from './controller/file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './model/file.entity';
import { DatabaseModule } from '../../../../shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './service/file.service';
import { S3Module } from '../../../../shared/s3/s3.module';
import { S3 } from '../../../../common/enums/s3.enum';
import { HttpModule } from '@nestjs/axios';
import { AuthorizationModule } from '../authorizaation/authorization.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    DatabaseModule,
    ConfigModule,
    S3Module.register(S3.MAIN),
    AuthorizationModule,
    HttpModule.register({
      validateStatus: (status) => status < 500,
    }),
  ],
  controllers: [FileController],
  providers: [Logger, FileService],
  exports: [FileService],
})
export class FileModule {}
