import { LoginResponseDto } from '../dto/login-response.dto';

export interface ILoginService {
  validateToken(token: string, domain?: string): Promise<LoginResponseDto>;
}
