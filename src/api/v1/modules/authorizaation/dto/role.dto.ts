import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  isArray,
  IsMongoId,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PermissionDto } from './permission.dto';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { NestedPermissionDto } from './nested-permission.dto';
import { Types } from 'mongoose';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';

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

  @Expose({ toPlainOnly: true })
  @ApiProperty({
    type: [NestedPermissionDto],
  })
  @ValidateNested()
  @Type(() => NestedPermissionDto)
  // @Transform(({ obj }) => {
  //   // console.log(obj);

  //   if (isArray(obj['permissionIds']))
  //     return obj['permissionIds']?.map((p) => {
  //       return new NestedPermissionDto(
  //         p instanceof Types.ObjectId ? { id: p.toString() } : p,
  //       );
  //     });

  //   if (obj['permissionIds'])
  //     return new NestedPermissionDto(
  //       typeof obj['permissionIds'] === 'string'
  //         ? { id: obj['permissionIds'] }
  //         : obj['permissionIds'],
  //     );
  // })
  @MongoRelationDto({
    dto: () => NestedPermissionDto,
    idFieldName: 'permissionIds',
  })
  @IsOptional()
  permissions: NestedPermissionDto[];

  @Expose({ toClassOnly: true })
  @ApiProperty({
    type: [String],
  })
  @IsOptional()
  // @Transform(({ obj }) => {
  //   // console.log(obj);
  //   if (isArray(obj['permissions'])) {
  //     return obj['permissions']?.map((p) => p.id);
  //   }
  //   return obj['permissions']?.id;
  // })
  @MongoRelationId({ fieldName: 'permissions' })
  permissionIds: string[];

  constructor(partial: Partial<RoleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
