import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { PermissionController } from './controller/permission.controller';
import { RoleController } from './controller/role.controller';
import Permission, { PermissionSchema } from './model/permission.entity';
import { Role, RoleSchema } from './model/role.entity';
import { PermissionService } from './service/permission.service';
import { RoleService } from './service/role.service';
import { DatabaseModule } from '../../../../shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [CaslAbilityFactory, RoleService, PermissionService, Logger],
  controllers: [RoleController, PermissionController],
  exports: [RoleService, PermissionService, CaslAbilityFactory],
})
export class AuthorizationModule {}
