import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { Types } from 'mongoose';
import { NestedUserDto } from '../../user/dto/user-nested.dto';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
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
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    description: 'the id of the refrenced user',
    example: new Types.ObjectId().toHexString(),
  })
  @MongoRelationId({ fieldName: 'user' })
  userId: string;

  @IsOptional()
  @MongoRelationDto({ dto: () => NestedUserDto, idFieldName: 'userId' })
  @Expose({ toPlainOnly: true })
  user: NestedUserDto;
}
