import { Expose } from 'class-transformer';
import { PurchaseDto } from './purchase.dto';

export class CreatePurchaseDto extends PurchaseDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
