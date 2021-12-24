import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorizaation/authorization.module';
import { ShipmentController } from './controller/shipment.controller';
import { Shipment, ShipmentSchema } from './model/shipment.entity';
import { ShipmentService } from './service/shipment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    DatabaseModule,
    AuthorizationModule,
    AuthenticationModule,
  ],
  providers: [ShipmentService, Logger],
  controllers: [ShipmentController],
  exports: [],
})
export class ShipmentModule {}
