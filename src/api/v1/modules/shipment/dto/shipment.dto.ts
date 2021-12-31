import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LeanDocument } from 'mongoose';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { Shipment } from '../model/shipment.entity';
import { ShipmentItemDto } from './shipment-item/shipment-item.dto';

export class ShipmentDto extends MongoBaseDto {
  constructor(partial: Partial<LeanDocument<Shipment>>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ type: [ShipmentItemDto] })
  @Expose()
  @Type(() => ShipmentItemDto)
  @ValidateNested({ each: true })
  items: ShipmentItemDto[];
}
