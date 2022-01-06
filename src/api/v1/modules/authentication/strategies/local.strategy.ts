import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../service/authentication.service';
import { UserDto } from '../../user/dto/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({ usernameField: 'phoneNumber' });
  }

  //validate user thorugh password strategy is handled here
  async validate(phoneNumber: string, password: string): Promise<any> {
    const user = await this.authService.validateUserWithPassword(
      phoneNumber,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return plainToClass(UserDto, user, {
      strategy: 'exposeAll',
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
}
