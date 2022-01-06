import {
  BadRequestException,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { CustomerService } from '../../customer/service/customer.service';
import { MedicineService } from '../../medicine/service/medicine.service';
import { UserDto } from '../../user/dto/user.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { PurchaseDto } from '../dto/purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { Purchase } from '../model/purchase.entity';
// this service extends the base service of mongo tool and the model and dto is passed to base service it is used for saving the purchases
// the create purchase method is used to create purchases and update the medicine stock.
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
    private readonly medicineService: MedicineService,
    private readonly customerServicer: CustomerService,
  ) {
    super(
      purchaseModel,
      PurchaseDto,
      logger,
      [{ path: 'customerId', select: 'fullName phoneNumber' }],
      undefined,
    );
  }

  async createPurchase({
    createPurchaseDto,
    user,
  }: {
    createPurchaseDto: CreatePurchaseDto;
    user: UserDto;
  }): Promise<PurchaseDto> {
    if (!isMongoId(createPurchaseDto.customerId))
      throw new BadRequestException('customer id is not valid');
    let sum = 0;
    for (const item of createPurchaseDto.purchaseItems) {
      const m = await this.medicineService._findOne({ _id: item.medicineId });
      if (m.count < item.count)
        throw new BadRequestException(
          `medicine ${m.name} count with id ${m.id} is not enough`,
        );
      m.count -= item.count;
      await m.save();
      sum += m.price * item.count;
    }
    createPurchaseDto.totalAmount = sum;
    const d = await this._create(createPurchaseDto, user);
    this.customerServicer._update(
      { _id: d.customerId },
      { $push: { purchaseIds: d.id } },
      { new: true },
      user,
    );
    return new PurchaseDto(
      (
        await this._findById(d.id, undefined, {
          populateOptions: [
            { path: 'purchaseItems.medicineId', select: 'name' },
          ],
        })
      ).toJSON(),
    );
  }
}
