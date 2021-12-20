import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserService } from '../../user/service/user.service';
import { LoginMethodDto } from '../dto/login-method.dto';
import { IloginMethod } from '../interface/login-method.interface';
import { genSalt, hash, compare } from 'bcrypt';
import { FilterOperationEnum } from '../../../../../common/enums/filter-operation.enum';
import { SmsService } from '../../../../../shared/sms/service/sms.service';
import { VerifyLookupDto } from '../../../../../shared/sms/dto/verify-lookup.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { FilterOptionDto } from '../../../../../common/dto/filter-option.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../../../common/config/app.config';
import { AppConfigs } from '../../../../../constants/app.configs';

export class LoginBySms implements IloginMethod {
  constructor(
    userService: UserService,
    smsService: SmsService,
    configService: ConfigService,
  ) {
    this.configService = configService;
    this.userService = userService;
    this.smsService = smsService;
  }

  private configService: ConfigService;

  private userService: UserService;

  private smsService: SmsService;

  async login(loginDto: LoginMethodDto): Promise<LoginResponseDto> {
    const { code, validateToken } = loginDto;
    if (code) {
      const { isEqual, phoneNumber } = await this.checkToken(
        code,
        validateToken,
      );

      if (!isEqual) throw new UnauthorizedException();
      return { user: await this.findUser(phoneNumber) };
    }

    if (!loginDto.phoneNumber) throw new BadRequestException('invalid inputs');

    await this.findUser(loginDto.phoneNumber);

    const {
      data: { password },
    } = await this.sendSms(loginDto.phoneNumber);

    const generatedToken = await this.tokenGenerator(
      password,
      loginDto.phoneNumber,
    );

    return { validateToken: generatedToken };
  }

  async tokenGenerator(payload: string, phoneNumber?: string) {
    const salt = await genSalt(10);
    const token = await hash(payload, salt);
    return jwt.sign(
      { token, phoneNumber },
      this.configService.get<AppConfig>(AppConfigs.APP).secret,
      {
        expiresIn: this.configService.get<AppConfig>(AppConfigs.APP)
          .redis_sms_code_expire,
      },
    );
  }

  async checkToken(code: string, token: string) {
    try {
      const decodedToken: any = await jwt.verify(
        token,
        this.configService.get<AppConfig>(AppConfigs.APP).secret,
      );
      const isEqual = await compare(code, decodedToken.token);

      if (isEqual) await this.deletePassword(decodedToken.phoneNumber);

      return { isEqual, ...decodedToken };
    } catch {
      return false;
    }
  }

  async sendSms(phoneNumber: string) {
    return await this.smsService.verifyLookup(
      plainToClass(VerifyLookupDto, { receptor: phoneNumber }),
    );
  }

  async findUser(phoneNumber: string) {
    return await this.userService.findOne([
      new FilterOptionDto({
        field: 'phoneNumber',
        operation: FilterOperationEnum.EQ,
        value: phoneNumber,
      }),
    ]);
  }

  async deletePassword(phoneNumber: string) {
    await this.smsService.verifyLookup(
      plainToClass(VerifyLookupDto, {
        receptor: phoneNumber,
        forceDelete: true,
      }),
    );
  }
}
