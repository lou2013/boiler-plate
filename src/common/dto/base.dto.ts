import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../api/v1/modules/user/dto/user.dto';

export default class BaseDto {
  @ApiProperty({ readOnly: true })
  @Expose()
  id!: number;

  @ApiProperty({ readOnly: true })
  @Expose({ toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  @Expose({ toPlainOnly: true })
  updatedAt: Date;

  @ApiProperty({ readOnly: true })
  @Expose({ toPlainOnly: true })
  deletedAt: Date;

  @ApiProperty({ readOnly: true })
  @Expose({ toPlainOnly: true })
  ownerId: number;

  @Type(() => UserDto)
  // @ApiProperty({ readOnly: true })
  @Expose({ toPlainOnly: true })
  owner: UserDto;

  constructor(partial: Partial<BaseDto>) {
    Object.assign(this, partial);
  }
}
