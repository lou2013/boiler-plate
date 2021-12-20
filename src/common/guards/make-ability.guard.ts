import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../api/v1/modules/authorizaation/casl/casl-ability.factory';
import { User } from '../../api/v1/modules/user/model/user.entity';
export class MakeAbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CaslAbilityFactory)
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user: User = context.switchToHttp().getRequest().user;

    try {
      if (user && user.rolesId) {
        const ability = this.caslAbilityFactory.createForUser(user, '*');
        context.switchToHttp().getRequest().ability = ability;
        return Boolean(ability);
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

// export const MakeAbilityGuard = (resource: Resource) => {
//   const guard = mixin(makeAbilityGuardMixing);
//   return guard;
// };
