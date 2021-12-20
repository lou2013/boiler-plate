import { AppEnvironment } from '../enums/app-environment.enum';

export interface AppConfig {
  name: string;
  description: string;
  version: string;
  secret: string;
  token_expiresIn: string;
  environment: AppEnvironment;
  forwarded_for: boolean;
  api_token: string;
  refresh_secret: string;
  refresh_expiresIn: string;
  system_organ_id: number;
  debug_mode: string;
  blurhash_url: string;
  //TODO (mh) generate this
  refresh_expiresIn_sc: number;
  redis_sms_code_expire: number;
}
