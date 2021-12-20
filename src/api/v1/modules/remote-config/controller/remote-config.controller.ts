import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiQuery,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { RemoteConfigDto } from '../dto/remote-config.dto';
import { RemoteConfigService } from '../service/remote-config.service';
import { PaginationResponseDto } from '../../../../../common/dto/pagination-response.dto';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import { Collection } from '../../../../../common/enums/collection.enum';
import { serverErrorDto } from '../../../../../common/dto/server-error.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { MakeAbilityGuard } from '../../../../../common/guards/make-ability.guard';
import { PoliciesGuard } from '../../../../../common/guards/policy.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CheckPolicies } from '../../../../../common/casl/policy-handler';
import { AppAbility } from '../../authorizaation/casl/casl-ability.factory';
import { Action } from '../../../../../common/enums/action.enum';
import { Resource } from '../../../../../common/enums/resource.enum';
import { UserDto } from '../../user/dto/user.dto';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { plainToClass } from 'class-transformer';
import { CreateRemoteConfigDto } from '../dto/create-remote-config.dto';
import { UpdateRemoteConfigDto } from '../dto/update-remote-config.dto';
import { FilterOptionDto } from 'src/common/dto/filter-option.dto';
import { FilterOperationEnum } from '../../../../../common/enums/filter-operation.enum';
import { GetRemoteConfigByKeyQuery } from '../dto/get-remote-config-by-key-query.dto';

@Controller('/')
@ApiTags(Collection.REMOTE_CONFIG)
@ApiNotFoundResponse({
  description: 'the requested data not found',
  type: serverErrorDto,
})
export class RemoteConfigController {
  constructor(private remoteConfigService: RemoteConfigService) {}

  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description:
      'everything was ok a paginated response is returned to the user',
    type: PaginationResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.REMOTE_CONFIG),
  )
  @Get('/')
  async getAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<RemoteConfigDto>> {
    return await this.remoteConfigService.findAll(paginationDto);
  }

  @Get('/data')
  @ApiOkResponse({
    type: RemoteConfigDto,
  })
  @ApiQuery({ type: GetRemoteConfigByKeyQuery })
  findOneByKey(
    @Query() queryDto: GetRemoteConfigByKeyQuery,
  ): Promise<RemoteConfigDto> {
    return this.remoteConfigService.findOne(
      [
        new FilterOptionDto({
          field: 'key',
          operation: FilterOperationEnum.EQ,
          value: queryDto.key,
        }),
      ],
      { select: 'data' },
    );
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.REMOTE_CONFIG),
  )
  @ApiOkResponse({
    type: RemoteConfigDto,
  })
  findOne(@Param('id') id: string): Promise<RemoteConfigDto> {
    return this.remoteConfigService.findById(id);
  }

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.REMOTE_CONFIG),
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
  @ApiCreatedResponse({
    type: RemoteConfigDto,
  })
  create(
    @Body() createDto: CreateRemoteConfigDto,
    @CurrentUser() user: UserDto,
  ): Promise<RemoteConfigDto> {
    return this.remoteConfigService.create(
      plainToClass(CreateRemoteConfigDto, createDto),
      user,
    );
  }

  @Patch('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.REMOTE_CONFIG),
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
  @ApiCreatedResponse({
    type: RemoteConfigDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRemoteConfigDto,
    @CurrentUser() user: UserDto,
  ): Promise<RemoteConfigDto> {
    return this.remoteConfigService.update(
      [
        new FilterOptionDto({
          field: '_id',
          operation: FilterOperationEnum.EQ,
          value: id,
        }),
      ],
      plainToClass(UpdateRemoteConfigDto, updateDto),
      user,
    );
  }

  @Delete('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.DELETE, Resource.REMOTE_CONFIG),
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
  @ApiOkResponse({
    type: RemoteConfigDto,
  })
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<RemoteConfigDto> {
    return this.remoteConfigService.delete(id, user);
  }
}
