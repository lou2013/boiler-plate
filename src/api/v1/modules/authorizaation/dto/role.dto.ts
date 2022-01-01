import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
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

  @Expose({ toClassOnly: true })
  @ApiProperty({
    type: [String],
  })
  @IsOptional()
  @MongoRelationId({ fieldName: 'permissions' })
  permissionIds: string[];

  @Expose({ toClassOnly: true })
  @ApiProperty({
    type: [NestedPermissionDto],
  })
  @ValidateNested()
  @Type(() => NestedPermissionDto)
  @MongoRelationDto({
    dto: () => NestedPermissionDto,
    idFieldName: 'permissions',
  })
  @IsOptional()
  permissions: NestedPermissionDto[];

  constructor(partial: Partial<RoleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
