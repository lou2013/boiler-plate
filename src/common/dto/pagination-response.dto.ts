import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { PaginationRequestDto } from './pagination-request.dto';

export class PaginationResponseDto<T> extends PaginationRequestDto {
  constructor(
    items: T[],
    totalItems: number,
    paginationRequestDto: PaginationRequestDto,
  ) {
    super();
    this.items = items;
    this.limit = paginationRequestDto.limit;
    this.sortBy = paginationRequestDto.sortBy;
    this.filter = paginationRequestDto.filter;
    this.totalItems = totalItems;
    this.page =
      paginationRequestDto.page > this.totalPages
        ? this.totalPages
        : paginationRequestDto.page;
  }

  @IsNumber()
  @ApiProperty()
  @Expose()
  totalItems: number;

  @IsNumber()
  @Expose()
  @ApiProperty()
  get totalPages(): number {
    return this.totalItems >= this.limit
      ? Math.ceil(this.totalItems / this.limit)
      : 1;
  }

  @Expose()
  @ApiProperty({ type: [] })
  items: T[];
}
