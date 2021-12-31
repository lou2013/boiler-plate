import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { NestedMedicineDto } from '../../../medicine/dto/nested-medicine.dto';

export class ShipmentItemDto {
  constructor(partial: Partial<ShipmentItemDto>) {
    Object.assign(this, partial);
  }

  @Expose({ toClassOnly: true })
  @IsOptional()
  @MongoRelationId({ fieldName: 'medicine' })
  @IsMongoId()
  medicineId: ObjectId;

  @ApiProperty({ type: () => NestedMedicineDto })
  @MongoRelationDto({ idFieldName: 'medicineId', dto: () => NestedMedicineDto })
  @Expose({ toPlainOnly: true })
  @ValidateNested()
  medicine: NestedMedicineDto;

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  count: number;
}
