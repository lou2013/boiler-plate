import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionDto } from '../dto/permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import Permission from '../model/permission.entity';
import { MongoBaseService } from '../../../../../common/service/mongo.base.service';
// this service extends the base service of mongo tool and the model and dto is passed to base service it is used for saving the permissions

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
