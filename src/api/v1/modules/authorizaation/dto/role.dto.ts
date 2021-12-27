import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MaxLength, ValidateNested } from 'class-validator';
import { PermissionDto } from './permission.dto';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { NestedPermissionDto } from './nested-permission.dto';
import { Types } from 'mongoose';

export class RoleDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    maxLength: 50,
    required: true,
    type: String,
    example: 'title',
  })
  @MaxLength(50)
  title!: string;

  @Expose()
  @ApiProperty({
    maxLength: 50,
    type: String,
    example: '*',
    default: '*',
  })
  @MaxLength(50)
  domain!: string;

  @Expose({ toClassOnly: true })
  @ApiProperty({
    type: [String],
  })
  @Transform(({ obj: { permissions } }) => {
    return permissions?.map((p) => p.id);
  })
  permissionIds: string[];

  @Expose({})
  @ApiProperty({
    type: [NestedPermissionDto],
  })
  @ValidateNested()
  @Type(() => NestedPermissionDto)
  @Transform(({ obj: { permissionIds } }) => {
    return permissionIds?.map((p) => {
      console.log(permissionIds);

      p instanceof Types.ObjectId ? p.toHexString() : p;
    });
  })
  permissions: NestedPermissionDto[];

  constructor(partial: Partial<RoleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
