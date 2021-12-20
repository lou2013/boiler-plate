import { LoginMethodDto } from '../dto/login-method.dto';
import { IloginMethod } from '../interface/login-method.interface';
import { UserService } from '../../user/service/user.service';
import { GoogleApiService } from '../../api-services/service/google-api.service';
import { ILoginService } from '../interface/login-service.interface';
import { LoginOrigins } from '../enum/login-origins.enum';
import { GoogleLoginService } from '../service/google-login.service';
import { LoginResponseDto } from '../dto/login-response.dto';

export class LoginByToken implements IloginMethod {
  constructor(googleApiService: GoogleApiService, userService: UserService) {
    this.loginOrigins = {
      google: undefined,
    };
    this.userService = userService;
    this.loginOrigins.google = new GoogleLoginService(googleApiService);
  }

  private userService: UserService;

  private loginOrigins: Record<LoginOrigins, ILoginService>;

  async login(dto: LoginMethodDto): Promise<LoginResponseDto> {
    try {
      const { token, origin } = dto;

      // const { id, createUserDto }
      const test = await this.loginOrigins[origin].validateToken(token);

      // const userDto = await this.userService.upsert(
      //   createUserDto,
      //   {} as UserDto,
      // );

      // this.organizationService.createMembership(
      //   organization.id.toString(),
      //   new CreateMembershipDto({
      //     organization,
      //     user: userDto,
      //     config: {
      //       internalNumbers: [],
      //       userOrganId: id,
      //     },
      //   }),
      //   userDto,
      // );

      return {};
    } catch (error) {
      throw error;
    }
  }
}
