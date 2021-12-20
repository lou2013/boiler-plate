import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { genSalt, hash } from 'bcrypt';
import { isDefined } from 'class-validator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';
import { User } from '../model/user.entity';
import { PaginateModel, UpdateQuery } from 'mongoose';
import { MongoQueryOptions } from '../../../../../common/dto/mongo-query-options.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterOptionDto } from '../../../../../common/dto/filter-option.dto';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import { PaginationResponseDto } from '../../../../../common/dto/pagination-response.dto';
import { SearchedUserDto } from '../dto/search-user.dto';

@Injectable()
export class UserService extends MongoBaseService<
  User,
  UserDto,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(User.name)
    readonly userModel: PaginateModel<User>,
  ) {
    super(
      userModel,
      UserDto,
      logger,
      [{ path: 'avatarId', select: 'hashKey meta.blurHash' }],
      undefined,
      (action: string, obj: UserDto) => [`user/${obj.id}`],
    );
  }

  async searchUser(
    paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<SearchedUserDto>> {
    paginationDto.limit = 20;
    paginationDto.page = 1;
    paginationDto.offset = 0;

    const result = await super._findAll(paginationDto);
    const models = result.rows.map((m) => new SearchedUserDto(m.toJSON()));

    return new PaginationResponseDto<SearchedUserDto>(
      models,
      result.count,
      paginationDto,
    );
  }

  async create(createDto: CreateUserDto, user: UserDto): Promise<UserDto> {
    const salt = await genSalt(10);
    if (isDefined(createDto.password))
      createDto.password = await hash(createDto.password, salt);

    return super.create(createDto, user);
  }

  async update(
    filter: FilterOptionDto[],
    updateDto: UpdateQuery<User> | UpdateUserDto,
    user: UserDto,
    options: MongoQueryOptions = { new: true },
  ): Promise<UserDto> {
    const salt = await genSalt(10);
    if (isDefined(updateDto.password))
      (updateDto as UpdateUserDto).password = await hash(
        updateDto.password,
        salt,
      );
    return await super.update(filter, updateDto, user, options);
  }
}
