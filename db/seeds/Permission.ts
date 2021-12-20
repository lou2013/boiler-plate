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
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111112'),
    action: Action.CREATE,
    resource: Resource.WORKSPACE,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111113'),
    action: Action.UPDATE,
    resource: Resource.WORKSPACE,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111114'),
    action: Action.DELETE,
    resource: Resource.WORKSPACE,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111115'),
    action: Action.MANAGE,
    resource: Resource.BOARD,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111116'),
    action: Action.MANAGE,
    resource: Resource.LIST,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111117'),
    action: Action.MANAGE,
    resource: Resource.CARD,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111118'),
    action: Action.MANAGE,
    resource: Resource.MEMBERSHIP,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111119'),
    action: Action.MANAGE,
    resource: Resource.BOARD_MEMBERSHIP,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    _id: new mongoose.Types.ObjectId('111111111120'),
    action: Action.MANAGE,
    resource: Resource.FILE,
    level: PermissionLevel.ALL,
    roles: [new mongoose.Types.ObjectId('222222222222')],
  },
];
