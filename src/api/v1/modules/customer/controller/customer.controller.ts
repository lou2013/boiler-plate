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
import { UserDto } from '../../user/dto/user.dto';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { CustomerService } from '../service/customer.service';
import { CustomerDto } from '../dto/customer.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@ApiTags(Collection.CUSTOMER)
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok',
  type: CustomerDto,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @ApiOperation({
    summary: 'get all customers',
    description: 'return the customer list with pagination',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.CUSTOMER),
  )
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CustomerDto>> {
    return await this.customerService.findAll(paginationDto);
  }

  @Post('/')
  @ApiOperation({
    summary: 'create customers',
    description: 'create new customer and return the customers data',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.CUSTOMER),
  )
  async create(
    @Body() createDto: CreateCustomerDto,
    @CurrentUser() user: UserDto,
  ): Promise<CustomerDto> {
    console.log(createDto);

    return await this.customerService.create(createDto, user);
  }

  @Get('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'get a cutsomer with id',
    description: 'find a customer with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.CUSTOMER),
  )
  findOne(@Param('id') id: string): Promise<CustomerDto> {
    return this.customerService.findById(id);
  }

  @Patch('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'update a customer with id',
    description: 'find and update user with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.USER),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @CurrentUser() user: UserDto,
  ): Promise<CustomerDto> {
    return this.customerService.update(
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
    ability.can(Action.DELETE, Resource.CUSTOMER),
  )
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<CustomerDto> {
    return this.customerService.delete(id, user);
  }
}
