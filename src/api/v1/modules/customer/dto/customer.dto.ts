import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { MongoBaseDto } from 'src/common/dto/mongo-base.dto';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { Customer } from '../model/customer.entity';
import { LeanDocument } from 'mongoose';
import { NestedPurchaseDto } from '../../purchase/dto/purchase.dto';

export class CustomerDto extends MongoBaseDto {
  constructor(partial: Partial<LeanDocument<Customer>>) {
    super(partial);
    Object.assign(this, partial);
  }

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
  @IsOptional()
  @IsMongoId({ each: true })
  purchaseIds: string[];

  @ApiProperty({
    description: 'the purchases of the user',
    type: () => NestedPurchaseDto,
    required: false,
  })
  @Expose({ toPlainOnly: true })
  @IsOptional()
  @MongoRelationDto({
    idFieldName: 'purchaseIds',
    dto: () => NestedPurchaseDto,
  })
  @Type(() => NestedPurchaseDto)
  @ValidateNested()
  purchases: NestedPurchaseDto[];
}
export class NestedCustomerDto extends CustomerDto {
  @IsOptional()
  fullName!: string;

  @IsOptional()
  phoneNumber!: string;
}
