import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ContractDto {
  @ApiProperty({
    description: 'the body of the contract',
    example: 'this is the body of the contract between user A and the pharmacy',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: 'when the contract will end',
    example: new Date(2019),
  })
  @Expose()
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'the income of the staff each mounth2',
    example: 10000000,
  })
  @Expose()
  @IsNumber()
  income: number;
}
