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
import { ShipmentDto } from '../dto/shipment.dto';
import { ShipmentService } from '../service/shipment.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UserDto } from '../../user/dto/user.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';

@ApiTags(Collection.SHIPMENT)
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok',
  type: ShipmentDto,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @ApiOperation({
    summary: 'get all shipements',
    description: 'return the shipement list with pagination',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.SHIPMENT),
  )
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ShipmentDto>> {
    return await this.shipmentService.findAll(paginationDto);
  }

  @Post('/')
  @ApiOperation({
    summary: 'create shipement',
    description: 'create new user and return the users data',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.SHIPMENT),
  )
  async create(
    @Body() createDto: CreateShipmentDto,
    @CurrentUser() user: UserDto,
  ): Promise<ShipmentDto> {
    return await this.shipmentService.create(createDto, user);
  }

  @Get('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'get a shipement with id',
    description: 'find a shipement with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.SHIPMENT),
  )
  findOne(@Param('id') id: string): Promise<ShipmentDto> {
    return this.shipmentService.findById(id);
  }

  @Patch('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'update a shipement with id',
    description: 'find and update shipement with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.SHIPMENT),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateShipmentDto,
    @CurrentUser() user: UserDto,
  ): Promise<ShipmentDto> {
    return this.shipmentService.update(
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
    ability.can(Action.DELETE, Resource.SHIPMENT),
  )
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<ShipmentDto> {
    return this.shipmentService.delete(id, user);
  }
}
