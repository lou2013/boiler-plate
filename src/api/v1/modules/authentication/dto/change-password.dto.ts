import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: 'qwertyuiop',
  })
  oldPassword?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: 'qwertyuiop',
  })
  newPassword: string;
}
