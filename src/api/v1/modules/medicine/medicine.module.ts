import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorizaation/authorization.module';
import { MedicineController } from './controller/medicine.controller';
import { Medicine, MedicineSchema } from './model/medicine.entity';
import { MedicineService } from './service/medicine.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
    DatabaseModule,
    AuthorizationModule,
    AuthenticationModule,
  ],
  providers: [MedicineService, Logger],
  controllers: [MedicineController],
  exports: [MedicineService],
})
export class MedicineModule {}
