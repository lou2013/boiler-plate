import { V1Module } from './v1.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ErrorModule } from './modules/error/error.module';
import { PresenceModule } from './modules/presence/presence.module';
import { CustomerModule } from './modules/customer/customer.moudle';
import { MedicineModule } from './modules/medicine/medicine.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { PurchaseModule } from './modules/purchase/purchase.module';

export const V1Routes = {
  path: '/v1',
  module: V1Module,
  children: [
    { path: '/error', module: ErrorModule },
    { path: '/auth', module: AuthenticationModule },
    {
      path: '/user',
      module: UserModule,
    },
    { path: '/presence', module: PresenceModule },
    { path: '/customer', module: CustomerModule },
    { path: '/medicine', module: MedicineModule },
    { path: '/shipment', module: ShipmentModule },
    { path: '/purchase', module: PurchaseModule },
  ],
};
