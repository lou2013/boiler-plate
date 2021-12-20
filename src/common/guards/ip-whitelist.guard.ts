import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/app.config';
import { AppConfigs } from '../../constants/app.configs';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ServerConfig } from '../config/server.config';

@Injectable()
export class IpWhiteListGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    @Inject(Logger) private logger: Logger,
  ) {
    this.ipWhiteList = this.configService.get<ServerConfig>(
      AppConfigs.SERVER,
    ).server_ips;
  }

  private loggerPrefix = 'ip white list guard';

  private ipWhiteList: string[];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let ip;
    if (!this.configService.get<AppConfig>(AppConfigs.APP).forwarded_for) {
      ip = request.headers['x-forwarded-for'];
      if (!ip) {
        return false;
      }
      if (!ip.includes(',')) {
        this.logger.error(
          this.loggerPrefix +
            `this request didn't have the normal format the format was :${ip}`,
        );
        return false;
      }
      ip = ip.split(',')[0];
    } else {
      ip = (request as any).connection.remoteAddress;
    }
    if (this.ipWhiteList.includes(ip)) return true;
    this.logger.log(this.loggerPrefix + `the ip that was rejected was ${ip}`);
    return false;
  }
}
