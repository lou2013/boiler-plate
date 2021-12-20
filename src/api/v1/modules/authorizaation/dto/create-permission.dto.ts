import { Expose } from 'class-transformer';
import { PermissionDto } from './permission.dto';

export class CreatePermissionDto extends PermissionDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
