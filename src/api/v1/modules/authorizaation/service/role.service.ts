import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleDto } from '../dto/role.dto';
import { SetPermissionDto } from '../dto/set-permission.dto';
import Permission from '../model/permission.entity';
import { Role } from '../model/role.entity';
import { UserDto } from '../../user/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { PermissionService } from './permission.service';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';

// this service extends the base service of mongo tool and the model and dto is passed to base service it is used for saving the roles
// since the permissions must be set on users and need some special logic the method is written in here
@Injectable()
export class RoleService extends MongoBaseService<
  Role,
  RoleDto,
  CreateRoleDto,
  CreateRoleDto
> {
  constructor(
    @InjectModel(Role.name)
    readonly roleModel: PaginateModel<Role>,
    @Inject(Logger)
    protected readonly logger: LoggerService,
    private permissionService: PermissionService,
  ) {
    super(roleModel, RoleDto, logger, [{ path: 'permissionIds' }]);
  }

  async setPermissions(
    id: string,
    setPermission: SetPermissionDto,
    user: UserDto,
  ): Promise<RoleDto> {
    const role: Role = await super._findById(id, null, {
      populateOptions: [{ path: 'permissionIds' }],
    });
    const permissions = await setPermission.permissionIds.map(async (p) => {
      let permission: Permission;
      try {
        permission = await this.permissionService._findOne({
          action: p.action,
          resource: p.resource,
          level: p.level,
        });
        return permission;
      } catch (error) {
        permission = new Permission(p);
        await permission.save();
        return permission;
      }
    });
    await role.$set('permissions', permissions);
    permissions.forEach(async (p) => (await p).roleIds.push(role.id));
    await role.save();
    return super.findById(id);
  }
}
