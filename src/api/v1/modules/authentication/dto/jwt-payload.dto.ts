import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';

export class JwtPayloadDto {
  @Expose()
  phoneNumber: string;

  @Expose()
  sub: string;

  constructor(partial: Partial<string | JwtPayload>) {
    Object.assign(this, partial);
  }
}
