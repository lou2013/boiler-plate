import { Expose } from 'class-transformer';
import { ShipmentDto } from './shipment.dto';

export class CreateShipmentDto extends ShipmentDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
