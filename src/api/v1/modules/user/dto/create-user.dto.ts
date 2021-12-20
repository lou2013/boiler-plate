import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
