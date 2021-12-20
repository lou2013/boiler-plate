import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { RoleDto } from './role.dto';

export class UpdateRoleDto extends RoleDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  title!: string;

  @IsOptional()
  domain!: string;

  @IsOptional()
  permissions: string[];
}
