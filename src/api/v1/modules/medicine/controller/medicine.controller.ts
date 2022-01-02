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
import { MedicineDto } from '../dto/medicine.dto';
import { MedicineService } from '../service/medicine.service';
import { CreateMedicineDto } from '../dto/create-medicine.dto';
import { UserDto } from '../../user/dto/user.dto';
import { UpdateMedicineDto } from '../dto/update-medicine.dto';
import { plainToClass } from 'class-transformer';

@ApiTags(Collection.MEDICINE)
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok',
  type: MedicineDto,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get('/')
  @ApiQuery({ type: PaginationRequestDto })
  @ApiOkResponse({
    description: 'every thing was ok',
    type: PaginationResponseDto,
  })
  @ApiOperation({
    summary: 'get all medicines',
    description: 'return the medicine list with pagination',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.MEDICINE),
  )
  async findAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<MedicineDto>> {
    const result = await this.medicineService.findAll(paginationDto);
    // result.items = result.items.map((item) => plainToClass(MedicineDto, item));
    return result;
  }

  @Post('/')
  @ApiOperation({
    summary: 'create medicine',
    description: 'create new user and return the users data',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.MEDICINE),
  )
  async create(
    @Body() createDto: CreateMedicineDto,
    @CurrentUser() user: UserDto,
  ): Promise<MedicineDto> {
    return await this.medicineService.create(createDto, user);
  }

  @Get('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'get a medicine with id',
    description: 'find a medicine with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.MEDICINE),
  )
  findOne(@Param('id') id: string): Promise<MedicineDto> {
    return this.medicineService.findById(id);
  }

  @Patch('/:id')
  @ApiNotFoundResponse({
    description: 'the requested data not found',
    type: serverErrorDto,
  })
  @ApiOperation({
    summary: 'update a medicine with id',
    description: 'find and update medicine with its id and return it',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.UPDATE, Resource.MEDICINE),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMedicineDto,
    @CurrentUser() user: UserDto,
  ): Promise<MedicineDto> {
    return this.medicineService.update(
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
    ability.can(Action.DELETE, Resource.MEDICINE),
  )
  delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<MedicineDto> {
    return this.medicineService.delete(id, user);
  }
}
