import { IsOptional } from 'class-validator';
import { PurchaseItemDto } from './purchase-item/purchase-item.dto';
import { PurchaseDto } from './purchase.dto';

export class NestedPurchaseDto extends PurchaseDto {
  @IsOptional()
  purchaseItems: PurchaseItemDto[];

  @IsOptional()
  totalAmount: number;
}
