import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';
import { CustomerDto } from './customer.dto';

export class UpdateCustomerDto extends CustomerDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  fullName!: string;

  @IsOptional()
  phoneNumber!: string;

  @IsOptional()
  purchases: PurchaseDto[];
}
