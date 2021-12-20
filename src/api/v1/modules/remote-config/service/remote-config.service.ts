import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RemoteConfig } from '../model/remote-config.entity';
import { PaginateModel } from 'mongoose';
import { RemoteConfigDto } from '../dto/remote-config.dto';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';
import { CreateRemoteConfigDto } from '../dto/create-remote-config.dto';
import { UpdateRemoteConfigDto } from '../dto/update-remote-config.dto';

@Injectable()
export class RemoteConfigService extends MongoBaseService<
  RemoteConfig,
  RemoteConfigDto,
  CreateRemoteConfigDto,
  UpdateRemoteConfigDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(RemoteConfig.name)
    readonly remoteConfigModel: PaginateModel<RemoteConfig>,
  ) {
    super(remoteConfigModel, RemoteConfigDto, logger);
  }
}
