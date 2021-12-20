import { LoginMethodDto } from '../dto/login-method.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

export interface IloginMethod {
  login(dto: LoginMethodDto): Promise<LoginResponseDto>;
}
