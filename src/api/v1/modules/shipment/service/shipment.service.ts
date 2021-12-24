import { Inject, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { ShipmentDto } from '../dto/shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { Shipment } from '../model/shipment.entity';

export class ShipmentService extends MongoBaseService<
  Shipment,
  ShipmentDto,
  CreateShipmentDto,
  UpdateShipmentDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(Shipment.name)
    readonly shipmentModel: PaginateModel<Shipment>,
  ) {
    super(shipmentModel, ShipmentDto, logger, [], undefined);
  }
}
