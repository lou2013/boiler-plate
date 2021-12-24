import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorizaation/authorization.module';
import { PresenceController } from './controller/presence.controller';
import { Presence, PresenceSchema } from './model/presence.entity';
import { PresenceService } from './service/presence.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Presence.name, schema: PresenceSchema },
    ]),
    DatabaseModule,
    AuthorizationModule,
    AuthenticationModule,
  ],
  providers: [PresenceService, Logger],
  controllers: [PresenceController],
  exports: [],
})
export class PresenceModule {}
