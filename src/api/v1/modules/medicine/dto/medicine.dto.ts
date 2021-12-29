import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LeanDocument, ObjectId } from 'mongoose';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { NestedShipmentDto } from '../../shipment/dto/nested-shipment.dto';
import { MedicineTypes } from '../enum/medicine-types.enum';
import { Medicine } from '../model/medicine.entity';
import { PlaceDto } from './place/palce.dto';

export class MedicineDto extends MongoBaseDto {
  constructor(partial: Partial<LeanDocument<Medicine>>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'famotidine' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 90000 })
  @Expose()
  @IsNumber()
  price: number;

  @ApiProperty({ example: MedicineTypes.Anti_Biotic, enum: MedicineTypes })
  @Expose()
  @IsEnum(MedicineTypes)
  type: MedicineTypes;

  @Expose()
  @ApiPropertyOptional({ example: 'jhfjklahsdlufhasduifhiuhi' })
  @IsOptional()
  @IsString()
  image: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 12 })
  count: number;

  @ApiProperty({ type: PlaceDto })
  @Expose()
  @Type(() => PlaceDto)
  @ValidateNested()
  place: PlaceDto;

  @Expose({ toClassOnly: true })
  @MongoRelationId({ fieldName: 'shipments' })
  @IsMongoId({ each: true })
  shipmentIds: ObjectId[];

  @ApiProperty({ type: () => [NestedShipmentDto] })
  @Expose({ toPlainOnly: true })
  @Type(() => NestedShipmentDto)
  @MongoRelationDto({ dto: NestedShipmentDto, idFieldName: 'shipmentIds' })
  shipments: NestedShipmentDto[];
}
