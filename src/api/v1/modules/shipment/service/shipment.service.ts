import {
  BadRequestException,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { MongoDbService } from 'src/shared/database/mongo/mongo-db.service';
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
    private readonly mongodb: MongoDbService,
  ) {
    super(
      shipmentModel,
      ShipmentDto,
      logger,
      // [],
      [{ path: 'items.medicineId', select: 'name' }],
      undefined,
    );
  }

  async createShipment({
    createShipmentDto,
    user,
  }: {
    createShipmentDto: CreateShipmentDto;
    user: UserDto;
  }): Promise<ShipmentDto> {
    const session = await this.mongodb.getDbConnection().startSession({});
    session.startTransaction({ maxTimeMS: 10000, maxCommitTimeMS: 10000 });
    try {
      const d = await this._create(createShipmentDto, user, undefined, session);
      for (const item of createShipmentDto.items) {
        await this.medicineService._update(
          { _id: item.medicineId },
          { $inc: { count: item.count }, $push: { shipmentIds: d.id } },
          { new: true },
          user,
          undefined,
          session,
        );
        throw new BadRequestException('test');
      }
      await session.commitTransaction();
      await session.abortTransaction();
      return new ShipmentDto(
        (
          await this._findById(d.id, undefined, {
            populateOptions: [{ path: 'items.medicineId', select: 'name' }],
          })
        ).toJSON(),
      );
    } catch (error) {
      session.endSession();
      await session.abortTransaction();
      throw error;
    }
  }
}
