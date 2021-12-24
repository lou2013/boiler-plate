import { Inject, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { PurchaseDto } from '../dto/purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { Purchase } from '../model/purchase.entity';

export class PurchaseService extends MongoBaseService<
  Purchase,
  PurchaseDto,
  CreatePurchaseDto,
  UpdatePurchaseDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(Purchase.name)
    readonly purchaseModel: PaginateModel<Purchase>,
  ) {
    super(purchaseModel, PurchaseDto, logger, [], undefined);
  }
}
