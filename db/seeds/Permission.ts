import * as mongoose from 'mongoose';
import { Action } from '../../src/common/enums/action.enum';
import { Resource } from '../../src/common/enums/resource.enum';
import { PermissionLevel } from '../../src/api/v1/modules/authorizaation/enum/permission-level.enum';

export default [
  {
    _id: new mongoose.Types.ObjectId('111111111111'),
    action: Action.MANAGE,
    resource: Resource.ALL,
    level: PermissionLevel.ALL,
    roleIds: [new mongoose.Types.ObjectId('222222222222')],
  },
];
