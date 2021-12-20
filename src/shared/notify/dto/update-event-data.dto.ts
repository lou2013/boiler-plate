import { Expose } from 'class-transformer';
export class UpdateEventDataDto {
  @Expose()
  data: Record<string, unknown>;

  @Expose()
  action: string;

  @Expose()
  id: string;

  @Expose()
  resource: string;

  @Expose()
  message: string;

  @Expose()
  time: Date;

  @Expose()
  room: string;

  constructor(partial: Partial<UpdateEventDataDto>) {
    Object.assign(this, partial);
  }
}
