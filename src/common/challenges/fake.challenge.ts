import { Inject, LoggerService, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Challenge } from './challenge.interface';

export abstract class FakeChallenge implements Challenge {
  constructor(
    protected readonly logger: LoggerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  createToken(userName: string): string {
    throw new NotImplementedException();
  }

  verifyToken(userName: string, token: string, code: string): boolean {
    throw new NotImplementedException();
  }
}
