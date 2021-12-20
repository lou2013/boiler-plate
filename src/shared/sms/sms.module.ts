import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SmsService } from './service/sms.service';
import { ConfigModule } from '@nestjs/config';
// mhalizadeh
// gozar1234

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
