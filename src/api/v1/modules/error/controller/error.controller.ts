import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorDto } from '../dto/error.dto';
import { ErrorService } from '../service/error.service';
import { PaginationResponseDto } from '../../../../../common/dto/pagination-response.dto';
import { CheckPolicies } from '../../../../../common/casl/policy-handler';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import { Action } from '../../../../../common/enums/action.enum';
import { Resource } from '../../../../../common/enums/resource.enum';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { MakeAbilityGuard } from '../../../../../common/guards/make-ability.guard';
import { PoliciesGuard } from '../../../../../common/guards/policy.guard';
import { AppAbility } from '../../authorizaation/casl/casl-ability.factory';
import { Collection } from '../../../../../common/enums/collection.enum';

@Controller('/')
@ApiTags(Collection.ERROR)
export class ErrorController {
  constructor(private errorService: ErrorService) {}

  @ApiOkResponse({
    description:
      'everything was ok a paginated response is returned to the user',
    type: PaginationResponseDto,
  })
  @ApiQuery({ type: PaginationRequestDto })
  @ApiBearerAuth()
  @Get('/')
  @UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.ERROR),
  )
  async getAll(
    @Query() paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ErrorDto>> {
    return await this.errorService.findAll(paginationDto);
  }
}
