import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { NestedMedicineDto } from '../../../medicine/dto/nested-medicine.dto';

export class PurchaseItemDto {
  constructor(partial: Partial<PurchaseItemDto>) {
    Object.assign(this, partial);
  }

  @MongoRelationId({ fieldName: 'medicine' })
  @Expose({ toClassOnly: true })
  @IsMongoId({ each: true })
  medicideId: ObjectId;

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  count: number;

  @ApiProperty({ type: NestedMedicineDto })
  @MongoRelationDto({ dto: () => NestedMedicineDto, idFieldName: 'medicineId' })
  @Expose({ toPlainOnly: true })
  @Type(() => NestedMedicineDto)
  medicine: NestedMedicineDto;
}
