import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';

export class ErrorDto extends MongoBaseDto {
  constructor(partial: Partial<ErrorDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty({ description: 'class where the error happens' })
  sourceClass: string;

  @Expose()
  @ApiProperty({ description: 'the method which error happens' })
  sourceMethod: string;

  @Expose()
  @ApiProperty({ description: 'the stack of the error' })
  stack: string;

  @Expose()
  @ApiProperty({ description: 'the message of the error' })
  message: string;

  @Expose()
  @ApiProperty({ description: 'the status of the error' })
  status: number;
}
