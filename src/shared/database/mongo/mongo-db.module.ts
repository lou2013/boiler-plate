import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdPlugin } from './plugins/mongo-id.Plugin';
import * as paginatePlugin from 'mongoose-paginate-v2';
import { TimestampPlugin } from './plugins/mongo-timestamp.Plugin';
import { MongoDbConfig } from '../../../common/config/mongo.config';
import { AppConfigs } from '../../../constants/app.configs';
import { MongoDbService } from './mongo-db.service';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config =
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<MongoDbConfig>(AppConfigs.MONGO_TEST)
            : configService.get<MongoDbConfig>(AppConfigs.MONGO_MAIN);

        return {
          uri: config.replicaMode
            ? `${config.url}:${config.port}/${config.dbName}/?replicaSet=${config.replicaSet}`
            : `${config.url}:${config.port}/${config.dbName}`,
          directConnection: true,
          connectionFactory: (connection) => {
            connection.plugin(IdPlugin);
            connection.plugin(TimestampPlugin);
            connection.plugin(paginatePlugin);
            return connection;
          },
        };
      },
    }),
  ],
  providers: [MongoDbService],
  exports: [MongoDbService],
})
export class MongoDbModule {}
