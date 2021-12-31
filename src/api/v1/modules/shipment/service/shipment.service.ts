import { Inject, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { MedicineService } from '../../medicine/service/medicine.service';
import { UserDto } from '../../user/dto/user.dto';
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
    private readonly medicineService: MedicineService,
  ) {
    super(shipmentModel, ShipmentDto, logger, [], undefined);
  }

  async createShipment({
    createShipmentDto,
    user,
  }: {
    createShipmentDto: CreateShipmentDto;
    user: UserDto;
  }): Promise<ShipmentDto> {
    for (const item of createShipmentDto.items) {
      await this.medicineService._update(
        { _id: item.medicineId },
        { $inc: { count: item.count } },
        { new: true },
        user,
      );
    }
    const d = await this._create(createShipmentDto, user);
    return new ShipmentDto(
      (
        await this._findById(d.id, undefined, {
          populateOptions: [{ path: 'items.medicineId' }],
        })
      ).toJSON(),
    );
  }
}
