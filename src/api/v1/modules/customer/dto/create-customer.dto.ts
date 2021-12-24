import { Expose } from 'class-transformer';
import { CustomerDto } from './customer.dto';

export class CreateCustomerDto extends CustomerDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
