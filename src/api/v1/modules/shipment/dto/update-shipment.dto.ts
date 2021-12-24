import { Expose } from 'class-transformer';
import { ShipmentDto } from './shipment.dto';

export class UpdateShipmentDto extends ShipmentDto {
  @Expose({ toPlainOnly: true })
  id: string;
}
