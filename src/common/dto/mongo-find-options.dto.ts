import { Expose } from 'class-transformer';
import { PopulateOptions } from 'mongoose';

export class MongoFindOptions {
  @Expose()
  projection?: Record<string, unknown> = {};

  @Expose()
  options?: Record<string, unknown> = {};

  @Expose()
  populateOptions?: Array<PopulateOptions> = [];

  @Expose()
  select?: string | Record<string, number>;

  constructor(partial: Partial<MongoFindOptions>) {
    Object.assign(this, partial);
  }
}
