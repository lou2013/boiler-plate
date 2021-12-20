import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize/types';
import { SequelizeTypescriptMigration } from 'sequelize-typescript-migration-v2';
import { join } from 'path';
import { MysqlConfig } from '../../../common/config/database.config';
import { AppConfigs } from '../../../constants/app.configs';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async function (configService: ConfigService) {
      const mainDatabaseConfig = configService.get<MysqlConfig>(
        AppConfigs.MAIN_DATABASE,
      );
      const sequelize = [
        new Sequelize({
          dialect: mainDatabaseConfig.dialect as Dialect,
          database: mainDatabaseConfig.database,
          username: mainDatabaseConfig.username,
          password: mainDatabaseConfig.password,
          host: mainDatabaseConfig.host,
          port: mainDatabaseConfig.port,
          ssl: mainDatabaseConfig.ssl,
          timezone: mainDatabaseConfig.timezone,
          repositoryMode: false,
          protocol: 'tcp',
          models: [],
          logging: false,
        }),
      ];
      return sequelize;
    },
    inject: [ConfigService],
  },
];
