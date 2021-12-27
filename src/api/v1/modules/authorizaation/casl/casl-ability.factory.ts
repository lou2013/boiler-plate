import {
  Ability,
  AbilityBuilder,
  AbilityTuple,
  ExtractSubjectType,
  Subject,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/model/user.entity';
import { PermissionLevel } from '../enum/permission-level.enum';
import Permission from '../model/permission.entity';
import { Role } from '../model/role.entity';
import { Resource } from '../../../../../common/enums/resource.enum';
import { Action } from '../../../../../common/enums/action.enum';

type Subjects = Resource;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    user: User,
    domain: string,
  ): Ability<AbilityTuple<string, Subject>> {
    return this.createForRoles(user.rolesId as unknown as Role[], domain, user);
  }

  createForRoles(
    roles: Role[],
    domain: string,
    user: User,
  ): Ability<AbilityTuple<string, Subject>> {
    roles = domain
      ? roles.filter((r) => r.domain === domain || r.domain === '*')
      : roles.filter((r) => r.domain === '*');

    const permissions = [];
    roles.forEach((r) => r.permissionIds.forEach((p) => permissions.push(p)));

    return this.createWithPermission(permissions, user.id);
  }

  createWithPermission(
    permissions: Permission[],
    userId: string,
  ): Ability<AbilityTuple<string, Subject>> {
    const { can, build } = new AbilityBuilder<Ability>(Ability);

    (permissions ?? []).forEach((permission) => {
      if (permission.level === PermissionLevel.OWN) {
        can(permission.action, permission.resource, {
          ownerId: { $eq: userId },
        });
      } else {
        can(permission.action, permission.resource);
      }
    });
    return build({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Resource>,
    });
  }
}
