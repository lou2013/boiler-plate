import {
  IsDate,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { Expose, Type, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { IsString } from 'class-validator';
import { NestedRoleDto } from '../../authorizaation/dto/nested-role.dto';
import { ContractDto } from './contract/contract.dto';
import { MongoRelationId } from 'src/common/decorators/mongo-relation-id.decorator';
import { MongoRelationDto } from 'src/common/decorators/mongo-relation-dto.decorator';

export class UserDto extends MongoBaseDto {
  @Expose()
  @ApiProperty({
    maxLength: 30,
    required: true,
    type: String,
    example: 'Walsh',
  })
  @MaxLength(30)
  @IsString()
  username!: string;

  @Expose()
  @ApiProperty({
    maxLength: 30,
    required: true,
    type: String,
    example: 'Walsh Aurore',
  })
  @MaxLength(60)
  @IsString()
  fullName!: string;

  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    required: true,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @Expose()
  gender: Gender;

  @ApiProperty({
    required: true,
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @Expose()
  birthDate: Date;

  @ApiProperty({
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
    example: 'qwertyuiop',
  })
  @MinLength(8)
  @MaxLength(64)
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '09123456789',
  })
  @IsMobilePhone('fa-IR')
  @Expose()
  phoneNumber!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: [NestedRoleDto],
  })
  @ValidateNested()
  @Type(() => NestedRoleDto)
  @MongoRelationDto({ dto: () => NestedRoleDto, idFieldName: 'rolesId' })
  roles!: NestedRoleDto[];

  @Expose({ toClassOnly: true })
  @MongoRelationId({ fieldName: 'roles' })
  rolesId!: string[];

  @Expose()
  @ApiProperty({
    type: ContractDto,
  })
  @Type(() => ContractDto)
  @ValidateNested()
  contract: ContractDto;

  constructor(partial: Partial<UserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
