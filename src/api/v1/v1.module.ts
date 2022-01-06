import { Module } from '@nestjs/common';
import { V1Routes } from './v1.routes';
import { RouterModule } from 'nest-router';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthorizationModule } from './modules/authorizaation/authorization.module';
import { ErrorModule } from './modules/error/error.module';
import { PresenceModule } from './modules/presence/presence.module';
import { CustomerModule } from './modules/customer/customer.moudle';
import { MedicineModule } from './modules/medicine/medicine.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { FileModule } from './modules/files/file.module';
// every module in the v1 routes of this project is here
@Module({
  imports: [
    RouterModule.forRoutes([V1Routes]),
    UserModule,
    AuthenticationModule,
    AuthorizationModule,
    ErrorModule,
    PresenceModule,
    CustomerModule,
    MedicineModule,
    ShipmentModule,
    PurchaseModule,
    FileModule,
  ],
})
export class V1Module {}
