import { LoggerService, NotImplementedException } from '@nestjs/common';

export interface Challenge {
  createToken(userName: string): string;
  verifyToken(userName: string, token: string, code: string): boolean;
}
