import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseModel } from '../../../../../common/models/mongo-base-model.entity';

@Schema({ _id: false, versionKey: false })
export class Contract extends MongoBaseModel {
  @Prop({ unique: true })
  body!: string;

  @Prop({ type: Number })
  income!: number;

  @Prop({ type: Date })
  dueDate!: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);

ContractSchema.pre('save', function () {
  if (!this.ownerId || this.ownerId === '') this.ownerId = this._id;
});
