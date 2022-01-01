import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LeanDocument, Types } from 'mongoose';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import {
  CustomerDto,
  NestedCustomerDto,
} from '../../customer/dto/customer.dto';
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

  @ApiProperty({ example: 100000, readOnly: true })
  @Expose({ toPlainOnly: true })
  @IsNumber()
  @IsOptional()
  totalAmount: number;

  @ApiProperty({ example: '123458756123123' })
  @Expose()
  @IsString()
  receipt: string;

  @Expose({ toClassOnly: true })
  @MongoRelationId({ fieldName: 'customer' })
  @IsOptional()
  @IsMongoId()
  customerId: string;

  @ApiProperty({
    type: () => NestedCustomerDto,
  })
  @Expose({ toPlainOnly: true })
  @Type(() => NestedCustomerDto)
  @IsOptional()
  @MongoRelationDto({ dto: () => NestedCustomerDto, idFieldName: 'customerId' })
  customer: NestedCustomerDto;
}

export class NestedPurchaseDto extends PurchaseDto {
  constructor(partial: Partial<LeanDocument<Purchase>>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ example: new Types.ObjectId() })
  @Expose({ toPlainOnly: true })
  id?: string;

  @IsOptional()
  purchaseItems: PurchaseItemDto[];

  @IsOptional()
  totalAmount: number;
}
