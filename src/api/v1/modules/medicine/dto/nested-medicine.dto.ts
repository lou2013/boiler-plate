import { IsMongoId, IsOptional } from 'class-validator';
import { MedicineTypes } from '../enum/medicine-types.enum';
import { MedicineDto } from './medicine.dto';
import { PlaceDto } from './place/palce.dto';

export class NestedMedicineDto extends MedicineDto {
  @IsMongoId()
  id?: string;

  @IsOptional()
  name: string;

  @IsOptional()
  price: number;

  @IsOptional()
  type: MedicineTypes;

  @IsOptional()
  image: string;

  @IsOptional()
  count: number;

  @IsOptional()
  place: PlaceDto;
}
