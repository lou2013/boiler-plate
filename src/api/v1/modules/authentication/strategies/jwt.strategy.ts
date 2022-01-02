import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';
import { AppConfig } from '../../../../../common/config/app.config';
import { AppConfigs } from '../../../../../constants/app.configs';
import { UserDto } from '../../user/dto/user.dto';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AppConfig>(AppConfigs.APP).secret,
    });
  }

  async validate(payload: any): Promise<UserDto> {
    try {
      return await this.userService.findById(payload.sub, null, {
        populateOptions: [
          {
            path: 'rolesId',
            populate: {
              path: 'permissionIds',
              // select: '-roleIds',
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);

      if (error.status === 404) {
        throw new UnauthorizedException('Unauthenticated');
      }
    }
  }
}
