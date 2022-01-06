import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Action } from 'src/common/enums/action.enum';
import { Resource } from 'src/common/enums/resource.enum';
import { PresenceDto } from '../../presence/dto/presence.dto';
import { NestedUserDto } from '../../user/dto/user-nested.dto';

export class ProfileDto {
  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: NestedUserDto })
  @Expose()
  @Type(() => NestedUserDto)
  user: NestedUserDto;

  @ApiProperty({
    example: `{
      user:{
        create: true,
        read: true,
        update: true,
        delete: true
      }
  }`,
  })
  @Expose()
  abilities: Record<Resource, Record<Action, boolean>>;

  @ApiProperty({ type: PresenceDto })
  @Expose()
  @Type(() => PresenceDto)
  lastPresence: PresenceDto;
}
