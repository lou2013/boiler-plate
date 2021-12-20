import { Module } from '@nestjs/common';
import { MongoDbModule } from './mongo/mongo-db.module';
import { SequelizeModule } from './sequelize/sequelize.module';

@Module({
  imports: [SequelizeModule, MongoDbModule],
})
export class DatabaseModule {}
