import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Redis } from 'ioredis';
import { PaginateModel } from 'mongoose';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionDto } from '../dto/permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import Permission from '../model/permission.entity';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';

@Injectable()
export class PermissionService extends MongoBaseService<
  Permission,
  PermissionDto,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor(
    @InjectModel(Permission.name)
    readonly permissionModel: PaginateModel<Permission>,
    @Inject(Logger)
    protected readonly logger: LoggerService,
  ) {
    super(permissionModel, PermissionDto, logger, []);
  }
}
