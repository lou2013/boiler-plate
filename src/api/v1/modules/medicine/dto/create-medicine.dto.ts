import { Expose } from 'class-transformer';
import { MedicineDto } from './medicine.dto';

export class CreateMedicineDto extends MedicineDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
