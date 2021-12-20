//TODO uncomment this
// import { CanActivate, ExecutionContext, Inject, mixin } from '@nestjs/common';
// import { User } from '@sentry/types';
// import { CaslAbilityFactory } from '../casl/casl-ability.factory';
// import { Action } from '../enums/action.enum';
// import { Resource } from '../enums/resource.enum';

// export const makeAbilityGuard = (resource: Resource) => {
//   class makeAbilityGuardMixing implements CanActivate {
//     constructor(
//       private caslAbilityFactory: CaslAbilityFactory,
//       @Inject(UserService)
//       private readonly userService: UserService, //   private roleRepository: RoleRepository, //   @Inject('PermissionRepository') //   private permissionRepository: PermissionRepository, //   @Inject('RoleRepository')
//     ) {}
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const user: User = context.switchToHttp().getRequest().user;
//       const userM = await this.userService._findById(user.id);
//       try {
//         const { organ } = context.switchToHttp().getRequest() as any;
//         if (user && user.roles && user.roles.length > 0) {
//           // const systemRoles = user.roles
//           const systemRoles = await this._findSystemRoles(userM.roles);
//           const systemPermissions = await this._findPermissions(
//             systemRoles,
//             resource,
//           );
//           const isAdmin = await this._isAdmin(systemPermissions);
//           if (isAdmin) {
//             // const ability = this.caslAbilityFactory.createWithPermission([
//             //   {
//             //     can: true,
//             //     resource: ResourceEnum.All,
//             //     action: ActionEnum.Manage,
//             //   } as PermissionDocument,
//             // ]);
//             // context.switchToHttp().getRequest().ability = ability;
//             // return Boolean(ability);
//           }
//           if (organ) {
//             if (!(await this._isInOrgan(user.memberships, organ))) return false;
//           }
//           const roles = await this._findRoles(
//             user.roles,
//             organ ? organ.id : undefined,
//           );
//           const rolesArray = await this._turnRolesToArray(roles);
//           const permissions = await this._findPermissions(rolesArray, resource);
//           const ability = this.caslAbilityFactory.createForUser(permissions);
//           context.switchToHttp().getRequest().ability = ability;
//           return Boolean(ability);
//         } else {
//           if (organ) {
//             // const userOrgans = user.memberships.map((om) => {
//             //   return om.organization.name;
//             // });
//             // if (!userOrgans.includes(organ.name)) {
//             //   return false;
//             // }
//             if (!(await this._isInOrgan(user.memberships, organ))) return false;
//           }
//           const ability = this.caslAbilityFactory.createWithPermission([]);
//           context.switchToHttp().getRequest().ability = ability;
//           return Boolean(ability);
//         }
//       } catch (error) {
//         throw error;
//       }
//     }
//     private async _findPermissions(
//       roles: Role[],
//       resource: Resource,
//     ): Promise<Permission[]> {
//       roles[0].permissions.filter;
//       const permissions: Permission[] = [];
//       roles.map((r) => {
//         const inPermissions = r.permissions.filter(
//           (p) => p.resource === resource,
//         );
//         inPermissions.forEach((p) => permissions.push(p));
//       });
//       return permissions;
//     }

//     private async _findSystemRoles(roles: Role[]): Promise<Role[]> {
//       return roles.filter((r) => r.domain === 'system');
//     }

//     private async _isAdmin(permissions: Permission[]): Promise<boolean> {
//       return Boolean(
//         permissions.find((per) => {
//           return per.resource === Resource.ALL && per.action === Action.MANAGE;
//         }),
//       );
//     }

//     private async _isInOrgan(memberships, organ) {
//       const userOrgans = memberships.map((om) => {
//         return om.organization.name;
//       });
//       if (!userOrgans.includes(organ.name)) {
//         return false;
//       }
//       return true;
//     }
//   }
//   const guard = mixin(makeAbilityGuardMixing);
//   return guard;
// };
