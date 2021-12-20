import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { UserDto } from '../../user/dto/user.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh-token'),
      ignoreExpiration: false,
      secretOrKey: 'fWSf!deVz@j+dH2Cvu6DNhAxs!gdq7+2',
    });
  }

  async validate(payload: any): Promise<UserDto> {
    return await this.userService.findById(payload.sub);
  }
}
