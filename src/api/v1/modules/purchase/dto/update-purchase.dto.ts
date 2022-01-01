import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PurchaseItemDto } from './purchase-item/purchase-item.dto';
import { PurchaseDto } from './purchase.dto';

export class UpdatePurchaseDto extends PurchaseDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  purchaseItems: PurchaseItemDto[];

  @IsOptional()
  totalAmount: number;

  @IsOptional()
  receipt: string;
}
