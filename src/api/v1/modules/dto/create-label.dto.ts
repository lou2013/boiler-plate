import { Expose } from 'class-transformer';
import { LabelDto } from './label.dto';

export class CreateLabelDto extends LabelDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
