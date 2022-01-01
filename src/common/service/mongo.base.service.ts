import {
  Injectable,
  LoggerService,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { MongoBaseModel } from '../models/mongo-base-model.entity';
import { PaginationRequestDto } from '../dto/pagination-request.dto';
import { FilterOptionDto } from '../dto/filter-option.dto';
import {
  OperationToMongoOperation,
  FilterOperationEnum,
} from '../enums/filter-operation.enum';
import { escapeLike, escapeRegExp } from '../utils/escape-regex';
import { plainToClass } from 'class-transformer';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { MongoFindOptions } from '../dto/mongo-find-options.dto';
import { MongoQueryOptions } from '../dto/mongo-query-options.dto';
import { UserDto } from '../../api/v1/modules/user/dto/user.dto';
import { MongoBaseDto } from '../dto/mongo-base.dto';
import { MongoParentRelation } from 'types/mongo-parent-relation.interface';
import { PaginateModel } from 'mongoose';
import { LeanDocument } from 'mongoose';
import { PopulateOptions } from 'mongoose';
import { UpdateQuery } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { isUndefined } from 'lodash';

// type QueryWithHelpers<
//   ResultType,
//   DocType,
//   THelpers = {},
//   RawDocType = DocType,
// > = Query<ResultType, DocType, THelpers, RawDocType> & THelpers;
// type EnforceDocument<T, TMethods, TVirtuals> = T extends Document
//   ? Require_id<T>
//   : Document<any, any, T> & Require_id<T> & TVirtuals & TMethods;

@Injectable()
export class MongoBaseService<
  T extends MongoBaseModel,
  ResponseDto extends MongoBaseDto,
  CreateDTO extends MongoBaseDto,
  UpdateDTO,
> {
  constructor(
    protected model: PaginateModel<T>,
    protected responseDto: new (
      result: Partial<LeanDocument<T>>,
    ) => ResponseDto,
    protected readonly logger: LoggerService,
    readonly populate: PopulateOptions[] = [],
    protected parent: MongoParentRelation = null,
    private readonly resolver: (
      action: string,
      obj: ResponseDto,
      parentId?: string,
    ) => string[] = null,
  ) {}

  async notifyListener(
    action: string,
    data: ResponseDto,
    parentId?: string,
  ): Promise<void> {
    try {
      return;
    } catch (error) {}
  }

  async findAll(
    paginationDto: PaginationRequestDto,
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
  ): Promise<PaginationResponseDto<ResponseDto>> {
    const result = await this._findAll(paginationDto, findOptions);
    const models = result.rows.map((m) => new this.responseDto(m.toJSON()));

    return new PaginationResponseDto<ResponseDto>(
      models,
      result.count,
      paginationDto,
    );
  }

  async findById(
    id: string,
    parentId: string = null,
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
  ): Promise<ResponseDto> {
    return new this.responseDto(
      (await this._findById(id, parentId, findOptions)).toJSON(),
    );
  }

  async findAllWithoutPagination(
    filter: FilterOptionDto[],
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
  ): Promise<ResponseDto[]> {
    const result = await this._findAllWithoutPagination(filter, findOptions);
    const models = result.map((m) => new this.responseDto(m.toJSON()));
    return models;
  }

  async findOne(
    filter: Array<FilterOptionDto>,
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
    parentId: string = null,
  ): Promise<ResponseDto> {
    const resultFilter = [];
    filter.forEach((filterOption) =>
      resultFilter.push(this.makeQuery(filterOption)),
    );
    return new this.responseDto(
      (
        await this._findOne({ $and: [...resultFilter] }, findOptions, parentId)
      ).toJSON(),
    );
  }

  async create(
    createDto: CreateDTO,
    user: UserDto,
    parentId: string = null,
  ): Promise<ResponseDto> {
    const result = new this.responseDto(
      (await this._create(createDto, user, parentId)).toJSON(),
    );

    this.findById(result.id, parentId, {
      populateOptions: this.populate,
    }).then((res) => {
      this.notifyListener('create', res, parentId);
    });

    return result;
  }

  async insertMany(
    createDtoArray: CreateDTO[],
    user: UserDto,
  ): Promise<ResponseDto[]> {
    return await (
      await this._insertMany(createDtoArray, user)
    ).map((item) => new this.responseDto(item.toJSON()));
  }

  async update(
    filter: FilterOptionDto[],
    updateDto: UpdateQuery<T> | UpdateDTO,
    user: UserDto,
    options: MongoQueryOptions = { new: true },
    parentId: string = null,
  ): Promise<ResponseDto> {
    const resultFilter = [];
    filter.forEach((filterOption) =>
      resultFilter.push(this.makeQuery(filterOption)),
    );

    const result = new this.responseDto(
      (
        await this._update(
          { $and: [...resultFilter] },
          updateDto,
          options,
          user,
          parentId,
        )
      ).toJSON(),
    );

    this.findById(result.id, parentId, {
      populateOptions: this.populate,
    }).then((res) => {
      this.notifyListener('update', res, parentId);
    });

    return result;
  }

  async updateMany(
    filter: FilterOptionDto[],
    updateDto: UpdateQuery<T> | UpdateDTO,
    user: UserDto,
    options: MongoQueryOptions = {},
    parentId: string = null,
  ): Promise<void> {
    const resultFilter = [];
    filter.forEach((filterOption) =>
      resultFilter.push(this.makeQuery(filterOption)),
    );

    await this._updateMany(
      { $and: [...resultFilter] },
      updateDto,
      options,
      user,
      parentId,
    );
  }

  async delete(
    id: string,
    user: UserDto,
    parentId: string = null,
    hard = false,
  ): Promise<ResponseDto> {
    const result = new this.responseDto(
      (await this._delete(id, user, parentId, hard))?.toJSON(),
    );

    this.notifyListener('delete', result, parentId);

    return result;
  }

  async deleteMany(
    filter: Record<string, unknown>,
  ): Promise<{ ok?: number; n?: number }> {
    return this._deleteMany(filter);
  }

  async restore(id: string): Promise<ResponseDto> {
    return new this.responseDto((await this._restore(id)).toJSON());
  }

  async _findAll(
    paginationDto: PaginationRequestDto,
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
  ): Promise<{
    rows: T[];
    count: number;
  }> {
    // const found = await this.parent.service._findOne(
    //   {
    //     _id: parentId,
    //     [this.parent.fieldName]: {
    //       $elemMatch: { _id: id, deletedAt: { $exists: false } },
    //     },
    //   },
    //   findOptions,
    // );
    // if (!found) throw new NotFoundException();
    // await found.populate(findOptions.populateOptions);
    // return found;

    if (this.parent) {
      const data = await this.model.paginate(
        {
          ...this.filterFromDto(paginationDto),
          deletedAt: { $exists: false },
        } as FilterQuery<T>,
        {
          sort: this.sortFieldsFromDto(paginationDto),
          page: paginationDto.page,
          projection: findOptions.projection,
          options: findOptions.options,
          limit: paginationDto.limit,
          populate: findOptions.populateOptions,
        },
      );

      return { rows: data.docs, count: data.totalDocs };
    } else {
      const data = await this.model.paginate(
        {
          ...this.filterFromDto(paginationDto),
          deletedAt: { $exists: false },
        } as FilterQuery<T>,
        {
          sort: this.sortFieldsFromDto(paginationDto),
          page: paginationDto.page,
          projection: findOptions.projection,
          options: findOptions.options,
          limit: paginationDto.limit,
          populate: findOptions.populateOptions,
        },
      );

      return { rows: data.docs, count: data.totalDocs };
    }
  }

  async _findById(
    id: string,
    parentId: string = null,
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
  ): Promise<T> {
    if (isMongoId(id)) {
      if (this.parent) {
        findOptions.projection = {
          ...findOptions.projection,
          [this.parent.fieldName]: 1,
        };

        findOptions.populateOptions = findOptions.populateOptions.map(
          (item) => {
            item.path = `${this.parent.fieldName}.${item.path}`;
            return item;
          },
        );

        const found = await this.parent.service._findOne(
          {
            _id: parentId,
            [this.parent.fieldName]: {
              $elemMatch: { _id: id, deletedAt: { $exists: false } },
            },
          },
          findOptions,
        );
        if (!found)
          throw new NotFoundException(
            `${this.parent.service.model.collection.name} not found`,
          );

        if (
          !found[this.parent.fieldName].find(
            (item) => item._id.toString() === id,
          )
        )
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );

        return found[this.parent.fieldName].find(
          (item) => item._id.toString() === id,
        );
      } else {
        const found = await this.model
          .findOne(
            {
              _id: id,
              deletedAt: { $exists: false },
            } as FilterQuery<T>,
            findOptions.projection,
            findOptions.options,
          )
          .populate(findOptions.populateOptions)
          .select(findOptions.select);
        if (!found)
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );
        return found;
      }
    } else
      throw new BadRequestException(
        `invalid id for model ${this.model.collection.name}`,
      );
  }

  async _findAllWithoutPagination(
    filter: FilterOptionDto[] = [],
    findOptions: MongoFindOptions = new MongoFindOptions({
      populateOptions: this.populate,
    }),
  ): Promise<T[]> {
    const resultFilter = [];

    filter.forEach((filterOption) =>
      resultFilter.push(this.makeQuery(filterOption)),
    );

    const found = await this.model.find(
      {
        $and: [...resultFilter, { deletedAt: { $exists: false } }],
      } as FilterQuery<T>,
      {},
      { populate: findOptions.populateOptions, select: findOptions.select },
    );

    return found;
  }

  async _findOne(
    filter: Record<string, unknown>,
    findOptions: MongoFindOptions = new MongoFindOptions({
      select: '',
      populateOptions: this.populate,
    }),
    parentId: string = null,
  ): Promise<T> {
    if (this.parent) {
      findOptions.populateOptions = findOptions.populateOptions.map((item) => {
        item.path = `${this.parent.fieldName}.${item.path}`;
        return item;
      });

      const found = await this.parent.service._findOne(
        {
          _id: parentId,
          [this.parent.fieldName]: {
            $elemMatch: { ...filter, deletedAt: { $exists: false } },
          },
        },
        findOptions,
      );

      if (!found)
        throw new NotFoundException(
          `${this.parent.service.model.collection.name} not found`,
        );
      // TODO return the field
      return found;
    } else {
      const found = await this.model
        .findOne(
          {
            ...filter,
            deletedAt: { $exists: false },
          } as FilterQuery<T>,
          findOptions.projection,
          findOptions.options,
        )
        .populate(findOptions.populateOptions)
        .select(findOptions.select);
      if (!found)
        throw new NotFoundException(`${this.model.collection.name} not found`);
      return found;
    }
  }

  async _create(
    createDto: CreateDTO,
    user: UserDto,
    parentId: string = null,
  ): Promise<T> {
    try {
      if (this.parent) {
        const found = await this.parent.service._update(
          {
            _id: parentId,
          },
          { $push: { [this.parent.fieldName]: createDto } },
          { new: true },
          user,
        );
        if (!found)
          throw new NotFoundException(
            `${this.parent.service.model.collection.name} not found`,
          );

        if (
          !found[this.parent.fieldName][found[this.parent.fieldName].length - 1]
        )
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );

        return found[this.parent.fieldName][
          found[this.parent.fieldName].length - 1
        ];
      } else {
        return await this.model.create(createDto);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async _insertMany(createDtoArray: CreateDTO[], user: UserDto): Promise<T[]> {
    try {
      return await this.model.insertMany(createDtoArray);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async _updateMany(
    filter: Record<string, unknown>,
    updateDto: UpdateQuery<T> | UpdateDTO,
    options: MongoQueryOptions,
    user: UserDto,
    parentId: string = null,
  ): Promise<boolean> {
    // TODO fix returned value
    try {
      for (const iterator of Object.keys(updateDto)) {
        isUndefined(updateDto[iterator]) && delete updateDto[iterator];
      }
      if (this.parent) {
        const updateField = {};
        Object.keys(updateDto).map((item) => {
          if (item.toString()[0] !== '$')
            updateField[`${this.parent.fieldName}.$[elem].${item}`] =
              updateDto[item];
          else {
            const obj = {};
            Object.keys(updateDto[item]).map(
              (elem) =>
                (obj[`${this.parent.fieldName}.$[elem].${elem}`] =
                  updateDto[item][elem]),
            );
            updateField[item] = obj;
          }
        });

        const transformedFilter = {
          ['$and']: [],
        };
        for (const element of filter['$and'] as any) {
          Object.keys(element).map((elemKey) =>
            transformedFilter['$and'].push({
              [`elem.${elemKey}`]: element[elemKey],
            }),
          );
        }

        const found = await this.parent.service._updateManyNested(
          {
            _id: parentId,
          },
          updateField,
          { new: true, upsert: true, arrayFilters: [transformedFilter] },
          user,
        );
        if (!found)
          throw new NotFoundException(
            `${this.parent.service.model.collection.name} not found`,
          );

        return found;
      } else {
        const found = await this.model.updateMany(
          {
            ...filter,
            deletedAt: { $exists: false },
          } as FilterQuery<T>,
          { ...updateDto, updatedBy: user.id },
          { ...options },
        );

        if (found.matchedCount !== 0)
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );
        return found.matchedCount !== 0;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async _updateManyNested(
    filter: Record<string, unknown>,
    updateDto: UpdateQuery<T> | UpdateDTO,
    options: MongoQueryOptions,
    user: UserDto,
  ): Promise<boolean> {
    return (
      (
        await this.model.updateMany(
          {
            ...filter,
            deletedAt: { $exists: false },
          } as FilterQuery<T>,
          { ...updateDto, updatedBy: user.id },
          { ...options },
        )
      ).matchedCount !== 0
    );
  }

  async _update(
    filter: Record<string, unknown>,
    updateDto: UpdateQuery<T> | UpdateDTO,
    options: MongoQueryOptions,
    user: UserDto,
    parentId: string = null,
  ): Promise<T> {
    try {
      for (const iterator of Object.keys(updateDto)) {
        isUndefined(updateDto[iterator]) && delete updateDto[iterator];
      }
      if (this.parent) {
        const updateField = {};
        Object.keys(updateDto).map((item) =>
          item.toString()[0] !== '$'
            ? (updateField[`${this.parent.fieldName}.$.${item}`] =
                updateDto[item])
            : (updateField[item] = updateDto[item]),
        );

        const found = await this.parent.service._update(
          {
            _id: parentId,
            [this.parent.fieldName]: {
              $elemMatch: { ...filter, deletedAt: { $exists: false } },
            },
          },
          updateField,
          { new: true, upsert: true },
          user,
        );
        if (!found)
          throw new NotFoundException(
            `${this.parent.service.model.collection.name} not found`,
          );

        // TODO fix [0]
        if (!found[this.parent.fieldName][0])
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );

        return found[this.parent.fieldName][0];
      } else {
        const found = await this.model.findOneAndUpdate(
          {
            ...filter,
            deletedAt: { $exists: false },
          } as FilterQuery<T>,
          { ...updateDto, updatedBy: user.id },
          { ...options },
        );

        if (!found)
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );
        return found;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async _delete(
    id: string,
    user: UserDto,
    parentId: string = null,
    hard = false,
  ): Promise<T> {
    if (isMongoId(id)) {
      let found;

      if (this.parent) {
        const found = await this.parent.service._update(
          {
            _id: parentId,
            [this.parent.fieldName]: {
              $elemMatch: { _id: id, deletedAt: { $exists: false } },
            },
          },
          hard
            ? {
                $pull: {
                  [this.parent.fieldName]: { _id: id },
                },
              }
            : {
                [`${this.parent.fieldName}.$.deletedAt`]: new Date(),
                [`${this.parent.fieldName}.$.updatedBy`]: user.id,
              },
          { new: true },
          user,
        );
        if (!found)
          throw new NotFoundException(
            `${this.parent.service.model.collection.name} not found`,
          );

        if (
          !hard &&
          !found[this.parent.fieldName].find(
            (item) => item._id.toString() === id,
          )
        )
          throw new NotFoundException(
            `${this.model.collection.name} not found`,
          );

        if (hard) return;

        return found[this.parent.fieldName].find(
          (item) => item._id.toString() === id,
        );
      } else {
        if (hard)
          found = await this.model.findByIdAndDelete(id, {
            new: true,
          });
        else
          found = await this.model.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: false } } as FilterQuery<T>,
            {
              deletedAt: new Date(),
              updatedBy: user.id,
            } as unknown as UpdateQuery<T>,
            {
              new: true,
            },
          );
        if (found) return found;
        throw new NotFoundException(`${this.model.collection.name} not found`);
      }
    }
    throw new BadRequestException(
      `invalid id for model ${this.model.collection.name}`,
    );
  }

  async _deleteMany(filter: Record<string, unknown>): Promise<any> {
    return await this.model.deleteMany({ ...filter } as FilterQuery<T>, {
      new: true,
    });
    //TODO fix type
  }

  async _restore(id: string): Promise<T> {
    if (!isMongoId(id))
      throw new BadRequestException(
        `invalid id for model ${this.model.collection.name}`,
      );
    return await this.model.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: true } } as FilterQuery<T>,
      { deletedAt: undefined } as unknown as UpdateQuery<T>,
      {
        new: true,
      },
    );
  }

  private sortFieldsFromDto(paginationDto: PaginationRequestDto) {
    const result = {};
    if (paginationDto.sortBy)
      paginationDto.sortBy.map((item) => {
        const sortField = this.sortField(item);
        if (sortField !== null) {
          result[sortField.field] = sortField.sortOrder;
        }
      });
    return result;
  }

  private sortField(field: string) {
    let sortOrder = 1;
    if (field[0] === '-') {
      field = field.substring(1);
      sortOrder = -1;
    }
    const tempSortItem = plainToClass(
      this.responseDto,
      { [field]: field },
      {
        excludeExtraneousValues: true,
      },
    );

    if (Object.values(tempSortItem).filter((v) => v !== undefined).length > 0) {
      return { field, sortOrder };
    }
  }

  private OperationFromFilterOption(filterOption: FilterOptionDto): symbol {
    return OperationToMongoOperation(filterOption.operation);
  }

  private filterFromDto(paginationDto: PaginationRequestDto) {
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

    if (resultFilter.length !== 0 && resultSearch.length !== 0)
      return { $and: [{ $and: resultFilter }, { $or: resultSearch }] };
    else if (resultFilter.length !== 0 && resultSearch.length === 0)
      return { $and: resultFilter };
    else if (resultFilter.length === 0 && resultSearch.length !== 0)
      return { $or: resultSearch };
  }

  private makeQuery(filterOption): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const operation = this.OperationFromFilterOption(filterOption);
    if (operation) {
      if (
        [
          FilterOperationEnum.REGEXP,
          FilterOperationEnum.IREGEXP,
          FilterOperationEnum.NOT_REGEXP,
          FilterOperationEnum.NOT_IREGEXP,
        ].includes(filterOption.operation)
      ) {
        filterOption.value = escapeRegExp(filterOption.value);

        result[filterOption.field] = {};
        if (
          [FilterOperationEnum.REGEXP, FilterOperationEnum.IREGEXP].includes(
            filterOption.operation,
          )
        ) {
          result[filterOption.field][operation] = filterOption.value;
          if (filterOption.operation === FilterOperationEnum.IREGEXP)
            result[filterOption.field]['$options'] = 'i';
        } else if (
          [
            FilterOperationEnum.NOT_REGEXP,
            FilterOperationEnum.NOT_IREGEXP,
          ].includes(filterOption.operation)
        ) {
          result[filterOption.field]['$not'] = {};
          result[filterOption.field]['$not'][operation] = filterOption.value;
          if (filterOption.operation === FilterOperationEnum.NOT_IREGEXP)
            result[filterOption.field]['$not']['$options'] = 'i';
        }
      } else if (
        [
          FilterOperationEnum.LIKE,
          FilterOperationEnum.ILIKE,
          FilterOperationEnum.NOT_LIKE,
          FilterOperationEnum.NOT_ILIKE,
        ].includes(filterOption.operation)
      ) {
        filterOption.value = escapeLike(filterOption.value);

        result[filterOption.field] = {};
        if (
          [FilterOperationEnum.LIKE, FilterOperationEnum.ILIKE].includes(
            filterOption.operation,
          )
        ) {
          result[filterOption.field][operation] = filterOption.value;

          if (filterOption.operation === FilterOperationEnum.ILIKE)
            result[filterOption.field]['$options'] = 'i';
        } else if (
          [
            FilterOperationEnum.NOT_LIKE,
            FilterOperationEnum.NOT_ILIKE,
          ].includes(filterOption.operation)
        ) {
          result[filterOption.field]['$not'] = {};
          result[filterOption.field]['$not'][operation] = filterOption.value;
          if (filterOption.operation === FilterOperationEnum.NOT_ILIKE)
            result[filterOption.field]['$not']['$options'] = 'i';
        }
      } else {
        result[filterOption.field] = {};
        result[filterOption.field][operation] = filterOption.value;
      }
      return result;
    }
  }
}
