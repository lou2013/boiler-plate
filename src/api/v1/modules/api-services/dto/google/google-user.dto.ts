import { Expose } from 'class-transformer';

export class GoogleUserDto {
  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  username: string;
}
