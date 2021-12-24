import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { RoleDto } from './role.dto';

export class NestedRoleDto extends RoleDto {
  @ApiProperty({ readOnly: false, example: '6155539c6d13a68972afb4f0' })
  @Expose()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  title!: string;

  @IsOptional()
  domain!: string;

  @IsOptional()
  permissionIds: string[];
}
