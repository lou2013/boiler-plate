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
import { Expose, Type, Transform, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MongoBaseDto } from '../../../../../common/dto/mongo-base.dto';
import { IsString } from 'class-validator';
import { NestedRoleDto } from '../../authorizaation/dto/nested-role.dto';
import { Types } from 'mongoose';
import { ContractDto } from './contract/contract.dto';

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
  @Transform(
    ({ obj: { rolesId } }) => {
      return rolesId?.map(
        (item) =>
          new NestedRoleDto(
            item instanceof Types.ObjectId ? { id: item.toString() } : item,
          ),
      );
    },
    { toPlainOnly: true },
  )
  roles!: NestedRoleDto[];

  @Expose({ toClassOnly: true })
  @Transform(
    ({ obj: { roles } }) => {
      return roles?.map((item) => item.id);
    },
    { toClassOnly: true },
  )
  rolesId!: string[];

  @Expose()
  @ApiProperty({
    type: ContractDto,
  })
  contract: ContractDto;

  constructor(partial: Partial<UserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
