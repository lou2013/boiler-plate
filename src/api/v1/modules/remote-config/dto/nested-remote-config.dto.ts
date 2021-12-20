import { IsOptional } from 'class-validator';
import { RemoteConfigDto } from './remote-config.dto';

export class NestedRemoteConfigDto extends RemoteConfigDto {
  @IsOptional()
  key: string;

  @IsOptional()
  description: string;

  @IsOptional()
  data: Record<string, unknown>;
}
