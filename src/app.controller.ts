import {
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Controller('pos')
export class AppController {
  constructor(
    private configService: ConfigService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Get('/')
  async ability() {
    return 'hello :D';
  }

  @Post('/pos')
  async pos() {
    return (Math.floor(Math.random() * 900000000000) + 100000000000).toString();
  }
}
