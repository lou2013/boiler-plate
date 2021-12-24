import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongoose';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { PlaceDto } from './place/palce.dto';

export class MedicineDto extends MongoBaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  price: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  type: string;

  @Expose()
  count: number;

  @Expose()
  @Type(() => PlaceDto)
  @ValidateNested()
  place: PlaceDto;

  @Expose({ toClassOnly: true })
  shipmentIds: ObjectId[];
}
