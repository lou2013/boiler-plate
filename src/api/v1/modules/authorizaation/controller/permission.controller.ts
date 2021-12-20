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
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { UserDto } from '../../user/dto/user.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionDto } from '../dto/permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionService } from '../service/permission.service';
import { serverErrorDto } from '../../../../../common/dto/server-error.dto';
import { AppAbility } from '../casl/casl-ability.factory';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import { PaginationResponseDto } from '../../../../../common/dto/pagination-response.dto';
import { Resource } from '../../../../../common/enums/resource.enum';
import { Action } from '../../../../../common/enums/action.enum';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { MakeAbilityGuard } from '../../../../../common/guards/make-ability.guard';
import { PoliciesGuard } from '../../../../../common/guards/policy.guard';
import { CheckPolicies } from '../../../../../common/casl/policy-handler';
import { FilterOperationEnum } from '../../../../../common/enums/filter-operation.enum';

@ApiTags('permission')
@Controller('/permission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiOkResponse({ description: 'every thing was ok', type: PermissionDto })
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.PERMISSION),
  )
  @ApiOperation({
    summary: 'get all permissions',
    description: 'return the permissions list with pagination',
  })
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PermissionDto>> {
    return await this.permissionService.findAll(paginationDto);
  }

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.PERMISSION),
  )
  @ApiOperation({
    summary: 'create permission',
    description: 'create new user and return the permission data',
  })
  create(
    @Body() createDto: CreatePermissionDto,
    @CurrentUser() user: UserDto,
  ): Promise<PermissionDto> {
    return this.permissionService.create(createDto, user);
  }

  @Get('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.PERMISSION),
  )
  @ApiOperation({
    summary: 'get a permission with id',
    description: 'find a permission with its id and return it',
  })
  findOne(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionService.findById(id);
  }

  @Patch('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.PERMISSION),
  )
  @ApiOperation({
    summary: 'soft delete a permission with id',
    description: 'find and soft delete permission with its id and return it',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePermissionDto,
    @CurrentUser() user: UserDto,
  ): Promise<PermissionDto> {
    return this.permissionService.update(
      [{ field: 'id', operation: FilterOperationEnum.EQ, value: id }],
      updateDto,
      user,
    );
  }

  @Delete('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.DELETE, Resource.PERMISSION),
  )
  @ApiOperation({
    summary: 'update a permission with id',
    description: 'find and update permission with its id and return it',
  })
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<PermissionDto> {
    return this.permissionService.delete(id, user);
  }
}
