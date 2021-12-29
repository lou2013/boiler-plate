import { Inject, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MongoBaseService } from 'src/common/service/mongo.base.service';
import { CreateMedicineDto } from '../dto/create-medicine.dto';
import { MedicineDto } from '../dto/medicine.dto';
import { UpdateMedicineDto } from '../dto/update-medicine.dto';
import { Medicine } from '../model/medicine.entity';

export class MedicineService extends MongoBaseService<
  Medicine,
  MedicineDto,
  CreateMedicineDto,
  UpdateMedicineDto
> {
  constructor(
    @Inject(Logger)
    protected readonly logger: LoggerService,
    @InjectModel(Medicine.name)
    readonly MedicineModel: PaginateModel<Medicine>,
  ) {
    super(MedicineModel, MedicineDto, logger, [], undefined);
  }
}
