import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResource } from '../model/update-resource.entity';
import { PaginateModel } from 'mongoose';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';

@Injectable()
export class UpdateResourceService extends MongoBaseService<
  UpdateResource,
  UpdateResourceDto,
  UpdateResourceDto,
  UpdateResourceDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(UpdateResource.name)
    readonly updateResourceModel: PaginateModel<UpdateResource>,
  ) {
    super(updateResourceModel, UpdateResourceDto, logger);
  }
}
