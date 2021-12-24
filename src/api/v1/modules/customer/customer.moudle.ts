import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorizaation/authorization.module';
import { CustomerController } from './controller/customer.controller';
import { Customer, CustomerSchema } from './model/customer.entity';
import { CustomerService } from './service/customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    DatabaseModule,
    AuthorizationModule,
    AuthenticationModule,
  ],
  providers: [CustomerService, Logger],
  controllers: [CustomerController],
  exports: [],
})
export class CustomerModule {}
