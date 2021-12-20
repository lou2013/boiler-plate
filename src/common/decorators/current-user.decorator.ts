import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../../api/v1/modules/user/dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest();
    return new UserDto(request.user);
  },
);
