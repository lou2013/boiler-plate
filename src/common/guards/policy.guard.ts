import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../casl/policy-handler';
import {
  CaslAbilityFactory,
  AppAbility,
} from '../../api/v1/modules/authorizaation/casl/casl-ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    const { ability }: { ability: AppAbility } = context
      .switchToHttp()
      .getRequest();
    if (ability) {
      return policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability),
      );
    } else {
      return false;
    }
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
