import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Action } from '../../../../../common/enums/action.enum';
import { PermissionLevel } from '../enum/permission-level.enum';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { Resource } from '../../../../../common/enums/resource.enum';

export class PermissionDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    enum: Resource,
    enumName: 'Resource',
    required: true,
    example: 'user',
  })
  @IsEnum(Resource)
  resource!: Resource;

  @Expose()
  @ApiProperty({
    enum: Action,
    enumName: 'Action',
    required: true,
    example: 'read',
  })
  @IsEnum(Action)
  action!: Action;

  @Expose()
  @ApiProperty({
    enum: PermissionLevel,
    enumName: 'PermissionLevel',
    required: true,
    example: 'all',
  })
  @IsEnum(PermissionLevel)
  level!: PermissionLevel;

  constructor(partial: Partial<PermissionDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
