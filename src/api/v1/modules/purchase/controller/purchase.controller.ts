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
import { PurchaseDto } from '../dto/purchase.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UserDto } from '../../user/dto/user.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { PurchaseService } from '../service/purchase.service';
import { plainToClass } from 'class-transformer';

@ApiTags(Collection.PURCHASE)
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok',
  type: PurchaseDto,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @ApiOperation({
    summary: 'get all purchases',
    description: 'return the purchase list with pagination',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.PURCHASE),
  )
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PurchaseDto>> {
    const result = await this.purchaseService.findAll(paginationDto, {
      select: '-purchaseItems',
      populateOptions: [{ path: 'customerId', select: 'fullName phoneNumber' }],
    });
    return result;
  }

  @Post('/')
  @ApiOperation({
    summary: 'create purchase',
    description: 'create new purchase and return the data',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.PURCHASE),
  )
  async create(
    @Body() createDto: CreatePurchaseDto,
    @CurrentUser() user: UserDto,
  ): Promise<PurchaseDto> {
    return await this.purchaseService.createPurchase({
      createPurchaseDto: createDto,
      user,
    });
  }

  @Get('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'get a purchase with id',
    description: 'find a purchase with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.PURCHASE),
  )
  async findOne(@Param('id') id: string): Promise<PurchaseDto> {
    return await this.purchaseService.findById(id, undefined, {
      populateOptions: [
        { path: 'customerId', select: 'fullName phoneNumber' },
        { path: 'purchaseItems.medicineId', select: 'name' },
      ],
    });
  }

  @Patch('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'update a purchase with id',
    description: 'find and update purchase with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.PURCHASE),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseDto,
    @CurrentUser() user: UserDto,
  ): Promise<PurchaseDto> {
    return this.purchaseService.update(
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
    summary: 'soft delete a purchase with id',
    description: 'find and soft delete purchase with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.DELETE, Resource.PURCHASE),
  )
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<PurchaseDto> {
    return this.purchaseService.delete(id, user);
  }
}
