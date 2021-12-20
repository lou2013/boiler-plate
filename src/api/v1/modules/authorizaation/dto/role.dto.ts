import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MaxLength, ValidateNested } from 'class-validator';
import { PermissionDto } from './permission.dto';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';

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

  @Expose()
  @ApiProperty({
    type: [PermissionDto],
  })
  @ValidateNested()
  @Type(() => PermissionDto)
  permissions: string[];

  constructor(partial: Partial<RoleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
