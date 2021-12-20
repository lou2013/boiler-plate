import {
  ForbiddenException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Gender } from '../../user/enum/gender.enum';
import { ILoginService } from '../interface/login-service.interface';
import { GoogleApiService } from '../../api-services/service/google-api.service';
import { LoginResponseDto } from '../dto/login-response.dto';

export class GoogleLoginService implements ILoginService {
  constructor(googleApiService: GoogleApiService) {
    this.googleApiService = googleApiService;
  }

  private googleApiService: GoogleApiService;

  async validateToken(token: string): Promise<LoginResponseDto> {
    const { data, status } = await this.googleApiService.validateToken(token);

    if (status === 401) {
      throw new UnauthorizedException('bad credentials');
    }
    if (status === 403) {
      throw new ForbiddenException('bad credentials');
    }
    if (status === 500) {
      throw new ServiceUnavailableException('service is unavailable');
    }
    const { first_name, last_name, username } = data;
    return {
      user: new CreateUserDto({
        firstName: first_name,
        lastName: last_name,
        phoneNumber: username,
        gender: Gender.OTHER,
      }),
    };
  }
}
