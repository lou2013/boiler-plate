import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.eyJwaG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge',
  })
  validateToken: string;
}
