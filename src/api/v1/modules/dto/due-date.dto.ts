import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate } from 'class-validator';
import { MongoBaseDto } from '../../../../common/dto/mongo-base.dto';

export class DueDateDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: new Date(),
  })
  @IsDate()
  start!: Date;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: new Date(),
  })
  @IsDate()
  target!: Date;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: new Date(),
  })
  @IsDate()
  end!: Date;

  constructor(partial: Partial<DueDateDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
