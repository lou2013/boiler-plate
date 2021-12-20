import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigs } from '../../../constants/app.configs';
import { SmsConfig } from '../../../common/config/sms.config';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { lastValueFrom } from 'rxjs';
import { VerifyLookupDto } from '../dto/verify-lookup.dto';
import { VerifyLookUpOutputDto } from '../dto/verify-lookup-output.dto';
import { SendMessageDto } from '../dto/send-message.dto';

@Injectable()
export class SmsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private smsConfig = this.configService.get<SmsConfig>(AppConfigs.SMS);

  async verifyLookup(
    verifyLookupDto: VerifyLookupDto,
  ): Promise<AxiosResponse<VerifyLookUpOutputDto>> {
    try {
      return await lastValueFrom(
        this.httpService.post(
          `${this.smsConfig.baseUrl}/verify-lookup`,
          verifyLookupDto,
          {
            headers: {
              token: this.smsConfig.organToken,
            },
          },
        ),
      );
    } catch (error) {
      console.log(error.response);
    }
  }

  async send(sendMessageDto: SendMessageDto): Promise<void> {
    try {
      await lastValueFrom(
        this.httpService.post(
          `${this.smsConfig.baseUrl}/send`,
          sendMessageDto,
          {
            headers: {
              token: this.smsConfig.organToken,
            },
          },
        ),
      );
    } catch (error) {
      console.log(error.response);
    }
  }
}
