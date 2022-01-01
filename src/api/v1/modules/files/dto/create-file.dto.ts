import { Expose } from 'class-transformer';
import { FileDto } from './file.dto';

export class CreateFileDto extends FileDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
