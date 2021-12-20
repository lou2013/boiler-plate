import { Expose } from 'class-transformer';

//TODO replace this
export class MongoQueryOptions {
  @Expose()
  arrayFilters?: { [key: string]: any }[];

  @Expose()
  multi?: boolean;

  @Expose()
  new?: boolean;

  @Expose()
  upsert?: boolean;

  @Expose()
  timestamps?: boolean;

  constructor(partial: Partial<MongoQueryOptions>) {
    Object.assign(this, partial);
  }
}
