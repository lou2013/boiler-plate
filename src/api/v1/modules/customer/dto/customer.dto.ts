import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isArray, IsPhoneNumber, IsString, Length } from 'class-validator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';
import { Types } from 'mongoose';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
export class CustomerDto extends MongoBaseDto {
  @ApiProperty({
    description: 'the full name of the customer',
    example: 'John Doe',
  })
  @Expose()
  @IsString()
  @Length(5, 50)
  fullName!: string;

  @ApiProperty({
    description: 'the phone number of the user',
    example: '09368876544',
  })
  @Expose()
  @IsString()
  @IsPhoneNumber('IR')
  phoneNumber!: string;

  @Expose({ toClassOnly: true })
  @MongoRelationId({ fieldName: 'purchases' })
  purchaseIds: string[];

  @ApiProperty({
    description: 'the purchases of the user',
    type: PickType(PurchaseDto, ['id']),
  })
  @MongoRelationDto({ idFieldName: 'purchaseIds' })
  @Expose({ toPlainOnly: true })
  @Type(() => PurchaseDto)
  purchases: PurchaseDto[];
}
