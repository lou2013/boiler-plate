import {
  Inject,
  Logger,
  LoggerService,
  BadRequestException,
} from '@nestjs/common';
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
    super(
      presenceModel,
      PresenceDto,
      logger,
      [{ path: 'userId', select: 'username fullName' }],
      undefined,
    );
  }

  async enterExit(user: UserDto): Promise<PresenceDto> {
    try {
      const presence = await this._findOne({
        date: new Date().toLocaleDateString('fa-IR'),
        userId: user.id,
      });
      if (!presence.enterTime) {
        presence.enterTime = new Date();
        await presence.save();
        return new PresenceDto(presence.toJSON());
      }
      if (!presence.exitTime) {
        presence.exitTime = new Date();
        await presence.save();
        return new PresenceDto(presence.toJSON());
      }
      throw new BadRequestException('شما قبلا ورود و حروجتان را ثبت کرده اید');
    } catch (error) {
      if (error.status === 404) {
        return await this.create(
          {
            userId: user.id,
            date: new Date().toLocaleDateString('fa-IR'),
            enterTime: new Date(),
          } as any,
          user,
        );
      }
      throw error;
    }
  }
}
