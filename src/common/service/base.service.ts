import { Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import {
  FindAttributeOptions,
  Includeable,
  OrderItem,
  WhereOptions,
} from 'sequelize';
import { plainToClass } from 'class-transformer';
import BaseModel from '../models/base-model.entity';
import { SortOrder } from '../enums/sortorders.enum';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { PaginationRequestDto } from '../dto/pagination-request.dto';
import { FilterOptionDto } from '../dto/filter-option.dto';
import { OperationToSequlizeOperation } from '../enums/filter-operation.enum';
import { Op } from 'sequelize';
import { UserDto } from '../../api/v1/modules/user/dto/user.dto';

type repository = typeof BaseModel & { new (): any };

@Injectable()
export class BaseService<
  T extends BaseModel<T>,
  ResponseDto,
  CreateDTO,
  UpdateDTO,
> {
  constructor(
    protected repository: { new (): T },
    protected responseDto: new (result: T) => ResponseDto,
    protected readonly logger: LoggerService,
    protected readonly include: Includeable[] = [],
  ) {
    // protected readonly redisService: RedisService,
    // this.redisService.getClient();
  }

  async findAll(
    paginationDto: PaginationRequestDto,
    include: Includeable[] = this.include,
    attributes: FindAttributeOptions = null,
  ): Promise<PaginationResponseDto<ResponseDto>> {
    const result = await this._findAll(paginationDto, include, attributes);
    const models = result.rows.map(
      (model) => new this.responseDto(model.get()),
    );
    return new PaginationResponseDto<ResponseDto>(
      models,
      result.count,
      paginationDto,
    );
  }

  async findById(
    id: string,
    include: Includeable[] = this.include,
    attributes: FindAttributeOptions = null,
  ): Promise<ResponseDto> {
    return new this.responseDto(
      await (await this._findById(id, include, attributes)).get(),
    );
  }

  async findOne(
    options: WhereOptions<T['_attributes']>,
    include: Includeable[] = this.include,
    attributes: FindAttributeOptions = null,
  ): Promise<ResponseDto> {
    const model = await this._findOne(options, include, attributes);
    return new this.responseDto(await model.get());
  }

  async create(
    createDto: CreateDTO,
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<ResponseDto> {
    return new this.responseDto(
      await (await this._create(createDto, user, include)).get(),
    );
  }

  async createMany(
    createDto: CreateDTO[],
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<ResponseDto[]> {
    try {
      return await (
        await this._createMany(createDto, user, include)
      ).map((item) => new this.responseDto(item.get()));
    } catch (error) {
      throw error;
    }
  }

  async upsert(
    createDto: CreateDTO,
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<ResponseDto> {
    return new this.responseDto(await this._upsert(createDto, user, include));
  }

  async update(
    id: string,
    updateDto: UpdateDTO,
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<ResponseDto> {
    return new this.responseDto(
      await (await this._update(id, updateDto, user, include)).get(),
    );
  }

  async delete(id: string, user: UserDto): Promise<ResponseDto> {
    return new this.responseDto(await (await this._delete(id, user)).get());
  }

  async _findAll(
    paginationDto: PaginationRequestDto,
    include: Includeable[] = this.include,
    attributes: FindAttributeOptions = null,
  ): Promise<{
    rows: T[];
    count: number;
  }> {
    const result = await (
      this.repository as unknown as repository
    ).findAndCountAll<T>({
      offset: paginationDto.offset
        ? paginationDto.offset
        : paginationDto.limit * (paginationDto.page - 1),
      limit: paginationDto.limit,
      order: this.sortFieldsFromDto(paginationDto),
      where: this.filterFromDto(paginationDto),
      include: include,
      attributes: attributes,
    });
    return result;
  }

  async _findById(
    id: string,
    include: Includeable[] = this.include,
    attributes: FindAttributeOptions = null,
  ): Promise<T> {
    const model = await (this.repository as unknown as repository).findByPk<T>(
      id,
      {
        include: include,
        attributes: attributes,
      },
    );
    if (!model) {
      throw new NotFoundException('Model with given id not found');
    }
    return model;
  }

  async _findOne(
    options: WhereOptions<T['_attributes']>,
    include: Includeable[] = this.include,
    attributes: FindAttributeOptions = null,
  ): Promise<T> {
    const model = await (this.repository as unknown as repository).findOne<T>({
      where: options,
      include: include,
      attributes: attributes,
    });
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return model;
  }

  async _create(
    createDto: CreateDTO,
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<T> {
    (createDto as unknown as T).ownerId = +user.id;
    const model = await (this.repository as unknown as repository).create<T>(
      createDto as unknown as T,
      {
        include: include,
      },
    );
    const data = await model.save();
    return data;
  }

  async _createMany(
    createDto: CreateDTO[],
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<T[]> {
    (createDto as unknown as T[]).map((item) => (item.ownerId = +user.id));
    const model = await (
      this.repository as unknown as repository
    ).bulkCreate<T>(createDto as unknown as T[], {
      include,
    });
    return model;
  }

  async _upsert(
    createDto: CreateDTO,
    user: UserDto,
    include: Includeable[] = this.include,
  ): Promise<T> {
    (createDto as unknown as T).ownerId = +user.id;
    const model = await (this.repository as unknown as repository).upsert<T>(
      createDto as unknown as T,
    );
    return (model[0] as any).dataValues as T;
  }

  async _update(
    id: string,
    updateDto: UpdateDTO,
    user?: UserDto,
    include: Includeable[] = this.include,
  ): Promise<T> {
    const model = await (this.repository as unknown as repository).findByPk<T>(
      id,
    );
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    const data = await model.update(updateDto, {
      where: { id },
    });
    return data;
  }

  async _delete(id: string, user: UserDto): Promise<T> {
    const model = await (this.repository as unknown as repository).findByPk<T>(
      id,
    );
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    await model.destroy();
    return model;
  }

  private sortFieldsFromDto(paginationDto: PaginationRequestDto): OrderItem[] {
    const result: OrderItem[] = [];
    for (const item in paginationDto.sortBy) {
      const sortField = this.sortField(paginationDto.sortBy[item]);
      if (sortField != null) {
        result.push(sortField);
      }
    }
    return result;
  }

  private sortField(field: string): OrderItem {
    let sortOrder: SortOrder = SortOrder.ASC;
    if (field[0] === '-') {
      field = field.substring(1);
      sortOrder = SortOrder.DESC;
    }
    const tempSortItem = plainToClass(
      this.responseDto,
      { [field]: field },
      {
        excludeExtraneousValues: true,
      },
    );
    if (Object.values(tempSortItem).filter((v) => v != undefined).length > 0) {
      return [field, sortOrder];
    }
  }

  private OperationFromFilterOption(filterOption: FilterOptionDto): symbol {
    return OperationToSequlizeOperation(filterOption.operation);
  }

  private filterFromDto(paginationDto: PaginationRequestDto): WhereOptions {
    const resultFilter = [];

    const resultSearch = [];

    if (paginationDto.filter) {
      paginationDto.filter.forEach((filterOption) =>
        resultFilter.push(this.makeQuery(filterOption)),
      );
    }
    if (paginationDto.search) {
      paginationDto.search.forEach((filterOption) =>
        resultSearch.push(this.makeQuery(filterOption)),
      );
    }

    const finalResult = {};
    if (resultFilter.length !== 0 && resultSearch.length !== 0) {
      finalResult[Op.and] = resultFilter;
      finalResult[Op.or] = resultSearch;
    } else if (resultFilter.length !== 0 && resultSearch.length === 0)
      finalResult[Op.and] = resultFilter;
    else if (resultFilter.length === 0 && resultSearch.length !== 0)
      finalResult[Op.or] = resultSearch;
    return finalResult;
  }

  private makeQuery(filterOption) {
    const result = {};
    const operation = this.OperationFromFilterOption(filterOption);
    if (operation) {
      if (!result[filterOption.field]) result[filterOption.field] = {};
      result[filterOption.field][operation] = filterOption.value;
    }
    return result;
  }
}
