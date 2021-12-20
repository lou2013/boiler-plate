import { Handshake } from 'socket.io/dist/socket';
import { User } from '../src/api/v1/modules/user/model/user.entity';

export interface handshakeInfo extends Handshake {
  user: User;
  organization?: string;
  organizationName?: string;
}
