import { MongoBaseService } from '../src/common/service/mongo.base.service';

export interface MongoParentRelation {
  service: MongoBaseService<any, any, any, any>;
  fieldName: string;
}
