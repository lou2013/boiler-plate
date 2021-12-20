import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Controller('app')
export class AppController {
  constructor(
    private configService: ConfigService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Get('')
  async ability() {
    return 'hello :D';
  }
}
