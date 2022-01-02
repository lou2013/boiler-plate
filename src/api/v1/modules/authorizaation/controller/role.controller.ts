import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleDto } from '../dto/role.dto';
import { SetPermissionDto } from '../dto/set-permission.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleService } from '../service/role.service';
import { serverErrorDto } from '../../../../../common/dto/server-error.dto';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { AppAbility } from '../casl/casl-ability.factory';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import { Resource } from '../../../../../common/enums/resource.enum';
import { Action } from '../../../../../common/enums/action.enum';
import { CheckPolicies } from '../../../../../common/casl/policy-handler';
import { PaginationResponseDto } from '../../../../../common/dto/pagination-response.dto';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { FilterOperationEnum } from '../../../../../common/enums/filter-operation.enum';
import { plainToClass } from 'class-transformer';

@ApiTags('role')
@Controller('/role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiOkResponse({ description: 'every thing was ok', type: RoleDto })
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @ApiOperation({
    summary: 'get all roles',
    description: 'return the roles list with pagination',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.ROLE),
  )
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<RoleDto>> {
    const result = await this.roleService.findAll(paginationDto);
    console.log(result);

    // result.items = result.items.map((item) => plainToClass(RoleDto, item));
    return result;
  }

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.ROLE),
  )
  @ApiOperation({
    summary: 'create role',
    description: 'create new user and return the role data',
  })
  create(
    @Body() createDto: CreateRoleDto,
    @CurrentUser() user: UserDto,
  ): Promise<RoleDto> {
    return this.roleService.create(createDto, user);
  }

  @Get('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.ROLE),
  )
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'get a role with id',
    description: 'find a role with its id and return it',
  })
  findOne(@Param('id') id: string): Promise<RoleDto> {
    return this.roleService.findById(id);
  }

  @Delete('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.DELETE, Resource.ROLE),
  )
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'soft delete a role with id',
    description: 'find and soft delete role with its id and return it',
  })
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<RoleDto> {
    return this.roleService.delete(id, user);
  }

  @Patch('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.ROLE),
  )
  @ApiOperation({
    summary: 'update a role with id',
    description: 'find and update role with its id and return it',
  })
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRoleDto,
    @CurrentUser() user: UserDto,
  ): Promise<RoleDto> {
    return this.roleService.update(
      [{ field: '_id', operation: FilterOperationEnum.EQ, value: id }],
      updateDto,
      user,
    );
  }

  @Put('/:id/permission')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.MANAGE, Resource.ROLE),
  )
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'set permissions',
    description: 'set permissions',
  })
  @ApiBody({ type: SetPermissionDto })
  setPermissions(
    @Param('id') id: string,
    @Body() setPermission: SetPermissionDto,
    @CurrentUser() user: UserDto,
  ): Promise<RoleDto> {
    return;
    // return this.roleService.setPermissions(id, setPermission, user);
  }
}
