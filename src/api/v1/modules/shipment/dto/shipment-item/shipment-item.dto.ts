import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNumber, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongoose';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { NestedMedicineDto } from '../../../medicine/dto/nested-medicine.dto';

export class ShipmentItemDto {
  constructor(partial: Partial<ShipmentItemDto>) {
    Object.assign(this, partial);
  }

  @MongoRelationId({ fieldName: 'medicine' })
  @Expose({ toClassOnly: true })
  @IsMongoId()
  medicideId: ObjectId;

  @ApiProperty({ type: () => NestedMedicineDto })
  @MongoRelationDto({ idFieldName: 'medicideId', dto: NestedMedicineDto })
  @Expose({ toPlainOnly: true })
  @ValidateNested()
  medicine: NestedMedicineDto;

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  count: number;
}
