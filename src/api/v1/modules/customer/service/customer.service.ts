import { Inject, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerDto } from '../dto/customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../model/customer.entity';

export class CustomerService extends MongoBaseService<
  Customer,
  CustomerDto,
  CreateCustomerDto,
  UpdateCustomerDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(Customer.name)
    readonly customerModel: PaginateModel<Customer>,
  ) {
    super(customerModel, CustomerDto, logger, [], undefined);
  }
}
