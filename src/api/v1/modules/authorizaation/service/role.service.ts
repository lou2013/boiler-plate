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
import { Redis } from 'ioredis';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';

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
    super(roleModel, RoleDto, logger, []);
  }

  async setPermissions(
    id: string,
    setPermission: SetPermissionDto,
    user: UserDto,
  ): Promise<RoleDto> {
    const role: Role = await super._findById(id, null, {
      populateOptions: [{ path: 'permissions' }],
    });
    const permissions = await setPermission.permissions.map(async (p) => {
      p.ownerId = user.id;
      let permission: Permission;
      try {
        permission = await this.permissionService._findOne({
          action: p.action,
          resource: p.resource,
          level: p.level,
        });
        return permission;
      } catch (error) {
        permission = new Permission(p as Permission);
        await permission.save();
        return permission;
      }
    });
    await role.$set('permissions', permissions);
    permissions.forEach(async (p) => (await p).roles.push(role.id));
    await role.save();
    return super.findById(id);
  }
}
