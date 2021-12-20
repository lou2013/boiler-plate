import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { RoleDto } from './role.dto';

export class CreateRoleDto extends RoleDto {
  @Expose({ toPlainOnly: true })
  id: string;

  @IsOptional()
  domain!: string;
}
