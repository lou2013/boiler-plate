import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorizaation/authorization.module';
import { CustomerModule } from '../customer/customer.moudle';
import { MedicineModule } from '../medicine/medicine.module';
import { PurchaseController } from './controller/purchase.controller';
import { Purchase, PurchaseSchema } from './model/purchase.entity';
import { PurchaseService } from './service/purchase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
    ]),
    DatabaseModule,
    AuthorizationModule,
    AuthenticationModule,
    MedicineModule,
    CustomerModule,
  ],
  providers: [PurchaseService, Logger],
  controllers: [PurchaseController],
  exports: [],
})
export class PurchaseModule {}
