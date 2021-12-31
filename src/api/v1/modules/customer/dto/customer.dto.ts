import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsMongoId,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { NestedPurchaseDto } from '../../purchase/dto/nested-purchase.dto';

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
  @IsMongoId({ each: true })
  purchaseIds: string[];

  @ApiProperty({
    description: 'the purchases of the user',
    type: PickType(PurchaseDto, ['id']),
  })
  @Expose({ toPlainOnly: true })
  @MongoRelationDto({
    idFieldName: 'purchaseIds',
    dto: () => NestedPurchaseDto,
  })
  @Type(() => NestedPurchaseDto)
  @ValidateNested()
  purchases: NestedPurchaseDto[];
}
