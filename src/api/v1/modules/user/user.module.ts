import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './model/user.entity';
import { UserService } from './service/user.service';
import { AuthorizationModule } from '../authorizaation/authorization.module';
import { DatabaseModule } from '../../../../shared/database/database.module';
// this is the module to handle users in the system
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DatabaseModule,
    ConfigModule,
    AuthorizationModule,
  ],
  providers: [UserService, Logger],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
