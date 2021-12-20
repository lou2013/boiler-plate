import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Action } from '../../../../../common/enums/action.enum';
import { PermissionLevel } from '../enum/permission-level.enum';
import { PermissionDto } from './permission.dto';
import { Resource } from '../../../../../common/enums/resource.enum';

export class NestedPermissionDto extends PermissionDto {
  @IsMongoId()
  id!: string;

  @IsOptional()
  resource: Resource;

  @IsOptional()
  action: Action;

  @IsOptional()
  level: PermissionLevel;
}
