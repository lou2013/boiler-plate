import {
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/app.config';
import { UserService } from '../../api/v1/modules/user/service/user.service';
import { handshakeInfo } from 'types/handshakeInfo';
import { JwtPayloadDto } from '../../api/v1/modules/authentication/dto/jwt-payload.dto';
import { AppConfigs } from '../../constants/app.configs';

export class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor({
    secured = false,
    logger,
    configService,
    userService,
  }: {
    secured: boolean;
    logger: LoggerService;
    configService: ConfigService;
    userService: UserService;
  }) {
    this.secured = secured;
    this.logger = logger;
    this.secret = configService.get<AppConfig>(AppConfigs.APP).secret;
    this.userService = userService;
  }

  private secured = false;

  protected logger: LoggerService;

  private readonly secret: string;

  protected userService: UserService;

  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
    this.logger.log(`gateway init`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    try {
      const handshake = client.handshake as handshakeInfo;

      if (this.secured) {
        const token = handshake.headers.authorization
          ? handshake.headers.authorization
          : (handshake.query.authorization as string);
        if (!token)
          throw new WsException({
            status: 401,
            message: 'unAuthorize',
          });
        const jwtPayload = new JwtPayloadDto(verify(token, this.secret));
        if (jwtPayload) {
          this.logger.log(jwtPayload);

          const user = await this.userService._findById(
            jwtPayload.sub.toString(),
          );

          if (!user) {
            throw new WsException('401');
          }

          handshake.user = user;

          this.logger.log(`Client connected: ${client.id}`);
        } else {
          this.logger.log(`Client disconnected: ${client.id}`);
          client.disconnect();
        }
      } else {
        this.logger.log(`Client connected: ${client.id}`);
      }
    } catch (error) {
      client.disconnect();
      this.logger.log(`Client disconnected: ${client.id}`);
      this.logger.error(error);
    }
  }
}
