import {
  Body,
  Controller,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Express, Response } from 'express';
import { FileService } from '../service/file.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { UserDto } from '../../user/dto/user.dto';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { FileDto } from '../dto/file.dto';
import { Get, StreamableFile } from '@nestjs/common';
import { GetFileQueryDto } from '../dto/get-file-query.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { MakeAbilityGuard } from '../../../../../common/guards/make-ability.guard';
import { serverErrorDto } from '../../../../../common/dto/server-error.dto';
import { PoliciesGuard } from '../../../../../common/guards/policy.guard';
import { CheckPolicies } from '../../../../../common/casl/policy-handler';
import { Action } from '../../../../../common/enums/action.enum';
import { Resource } from '../../../../../common/enums/resource.enum';
import { AppAbility } from '../../authorizaation/casl/casl-ability.factory';

@ApiTags('file-upload')
@ApiBadRequestResponse({
  description: 'invalid inputs',
  type: serverErrorDto,
})
@Controller('/')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.READ, Resource.FILE),
  )
  @ApiQuery({ type: GetFileQueryDto })
  @Get('/')
  async getFile(
    @Query() getFileQueryDto: GetFileQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    return this.fileService.getFile(getFileQueryDto.hashKey, res);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.CREATE, Resource.FILE),
  )
  @Post('/')
  @ApiCreatedResponse({ type: FileDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @CurrentUser() user: UserDto,
  ): Promise<FileDto> {
    return await this.fileService.uploadFile(file, createFileDto, user);
  }
}
