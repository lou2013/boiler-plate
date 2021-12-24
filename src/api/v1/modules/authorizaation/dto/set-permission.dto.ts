import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { NestedPermissionDto } from './nested-permission.dto';

export class SetPermissionDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: [NestedPermissionDto],
  })
  @ValidateNested()
  @Type(() => NestedPermissionDto)
  permissionIds!: NestedPermissionDto[];

  constructor(partial: Partial<SetPermissionDto>) {
    Object.assign(this, partial);
  }
}
