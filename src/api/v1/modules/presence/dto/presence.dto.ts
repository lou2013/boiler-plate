import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsMongoId, IsString } from 'class-validator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { Types } from 'mongoose';
import { NestedUserDto } from '../../user/dto/user-nested.dto';
export class PresenceDto extends MongoBaseDto {
  @ApiProperty({ description: 'the enter time', example: new Date() })
  @Expose()
  @IsDate()
  enterTime: Date;

  @Expose()
  @IsDate()
  @ApiProperty({ description: 'the exit time', example: new Date() })
  exitTime: Date;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'the date',
    example: new Date().toLocaleDateString(),
  })
  date: string;

  @Expose({ toClassOnly: true })
  @IsMongoId()
  @ApiProperty({
    description: 'the id of the refrenced user',
    example: new Types.ObjectId().toHexString(),
  })
  @Transform(
    ({ obj: { userId } }) => {
      return userId?.id;
    },
    { toClassOnly: true },
  )
  userId: string;

  @Transform(
    ({ obj: { userId } }) => {
      return new NestedUserDto(
        userId instanceof Types.ObjectId ? { id: userId.toString() } : userId,
      );
    },
    { toPlainOnly: true },
  )
  @Expose()
  user: NestedUserDto;
}
