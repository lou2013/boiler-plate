import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error } from '../model/error.entity';
import { PaginateModel } from 'mongoose';
import { ErrorDto } from '../dto/error.dto';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';

@Injectable()
export class ErrorService extends MongoBaseService<
  Error,
  ErrorDto,
  ErrorDto,
  ErrorDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(Error.name)
    readonly errorModel: PaginateModel<Error>,
  ) {
    super(errorModel, ErrorDto, logger);
  }
}
