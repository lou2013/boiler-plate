import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { LeanDocument } from 'mongoose';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { Purchase } from '../model/purchase.entity';
import { PurchaseItemDto } from './purchase-item/purchase-item.dto';

export class PurchaseDto extends MongoBaseDto {
  constructor(partial: Partial<LeanDocument<Purchase>>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ type: [PurchaseItemDto] })
  @ValidateNested()
  @Type(() => PurchaseItemDto)
  @Expose()
  purchaseItems: PurchaseItemDto[];

  @ApiProperty({ example: 100000 })
  @Expose()
  @IsNumber()
  totalAmount: number;
}
