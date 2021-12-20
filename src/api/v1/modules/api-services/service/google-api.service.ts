import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LoginUrlConfig } from '../../../../../common/config/login-url.config';
import { AppConfigs } from '../../../../../constants/app.configs';

@Injectable()
export class GoogleApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private baseUrl = this.configService.get<LoginUrlConfig>(
    AppConfigs.GOOGLE_LOGIN_URL,
  );

  async validateToken(token: string) {
    // : Promise<AxiosResponse<GoogleUserDto>> {
    console.log(token);

    // const config = {
    //   headers: { Authorization: `Bearer ${token}` },
    // };

    // return lastValueFrom(this.httpService.get(`${this.baseUrl}`, config));
    return {
      data: {
        first_name: '',
        last_name: '',
        username: '',
      },
      status: 200,
    };
  }
}
