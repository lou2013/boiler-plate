import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilterOperationEnum } from '../../../../../common/enums/filter-operation.enum';
import { Collection } from '../../../../../common/enums/collection.enum';
import { MakeAbilityGuard } from '../../../../../common/guards/make-ability.guard';
import { PoliciesGuard } from '../../../../../common/guards/policy.guard';
import { CheckPolicies } from '../../../../../common/casl/policy-handler';
import { AppAbility } from '../../authorizaation/casl/casl-ability.factory';
import { Action } from '../../../../../common/enums/action.enum';
import { Resource } from '../../../../../common/enums/resource.enum';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import { PaginationResponseDto } from '../../../../../common/dto/pagination-response.dto';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { serverErrorDto } from '../../../../../common/dto/server-error.dto';
import { FilterOptionDto } from '../../../../../common/dto/filter-option.dto';
import { plainToClass } from 'class-transformer';
import { PresenceDto } from '../dto/presence.dto';
import { PresenceService } from '../service/presence.service';
import { CreatePresenceDto } from '../dto/create-presence.dto';
import { UserDto } from '../../user/dto/user.dto';
import { UpdateUserDto } from '../../user/dto/update-user.dto';

@ApiTags(Collection.PRESENCE)
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok',
  type: PresenceDto,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class PresenceController {
  constructor(private readonly pressenceService: PresenceService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @ApiOperation({
    summary: 'get all users',
    description: 'return the users list with pagination',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.PRESENCE),
  )
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PresenceDto>> {
    return await this.pressenceService.findAll(paginationDto);
  }

  //   @Get('/search')
  //   @ApiQuery({ type: PaginationRequestDto })
  //   @ApiOkResponse({
  //     description: 'every thing was ok',
  //     type: PaginationResponseDto,
  //   })
  //   async searchAll(
  //     @Query() paginationDto: PaginationRequestDto,
  //   ): Promise<PaginationResponseDto<SearchedUserDto>> {
  //     return await this.userService.searchUser(paginationDto);
  //   }

  @Post('/')
  @ApiOperation({
    summary: 'create users',
    description: 'create new user and return the users data',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.PRESENCE),
  )
  async create(
    @Body() createDto: CreatePresenceDto,
    @CurrentUser() user: UserDto,
  ): Promise<PresenceDto> {
    return await this.pressenceService.createPresence(createDto, user);
  }

  @Get('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'get a user with id',
    description: 'find a user with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.PRESENCE),
  )
  findOne(@Param('id') id: string): Promise<PresenceDto> {
    return this.pressenceService.findById(id);
  }

  @Patch('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'update a user with id',
    description: 'find and update user with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.USER),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @CurrentUser() user: UserDto,
  ): Promise<PresenceDto> {
    return this.pressenceService.update(
      [
        new FilterOptionDto({
          field: '_id',
          operation: FilterOperationEnum.EQ,
          value: id,
        }),
      ],
      updateDto,
      user,
    );
  }

  @Delete('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'soft delete a user with id',
    description: 'find and soft delete user with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.DELETE, Resource.PRESENCE),
  )
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<PresenceDto> {
    return this.pressenceService.delete(id, user);
  }
}
