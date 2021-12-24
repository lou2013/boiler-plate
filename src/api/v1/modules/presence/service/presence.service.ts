import { Inject, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { UserDto } from '../../user/dto/user.dto';
import { CreatePresenceDto } from '../dto/create-presence.dto';
import { PresenceDto } from '../dto/presence.dto';
import { UpdatePresenceDto } from '../dto/update-presence.dto';
import { Presence } from '../model/presence.entity';

export class PresenceService extends MongoBaseService<
  Presence,
  PresenceDto,
  CreatePresenceDto,
  UpdatePresenceDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(Presence.name)
    readonly presenceModel: PaginateModel<Presence>,
  ) {
    super(presenceModel, PresenceDto, logger, [{ path: 'userId' }], undefined);
  }

  async createPresence(
    createDto: CreatePresenceDto,
    user: UserDto,
  ): Promise<PresenceDto> {
    return;
  }
}
