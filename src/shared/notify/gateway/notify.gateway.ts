import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { BaseGateway } from '../../../common/gateway/base.gateway';
import { UserService } from '../../../api/v1/modules/user/service/user.service';
import { RedisClients } from '../../../constants/redis.clients';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateEventDataDto } from '../dto/update-event-data.dto';
import { UpdateResourceService } from '../../../api/v1/modules/update-resource/service/update-resource.service';
import { UpdateResourceDto } from 'src/api/v1/modules/update-resource/dto/update-resource.dto';
import { UserDto } from '../../../api/v1/modules/user/dto/user.dto';

@WebSocketGateway({
  origins: '*:*',
  namespace: '/',
})
export class NotifyGateway extends BaseGateway {
  constructor(
    protected readonly userService: UserService,
    protected readonly updateResourceService: UpdateResourceService,
    @Inject(Logger)
    protected readonly logger: LoggerService,
    readonly configService: ConfigService,
    readonly redisService: RedisManager,
  ) {
    super({ secured: true, logger, configService, userService });

    this.Publisher = this.redisService.getClient(RedisClients.MAIN);
    this.Subscriber = this.redisService.getClient(RedisClients.PUBSUB);
    this.Subscriber.subscribe('update');
    this.Subscriber.on('message', (channel, msg) => {
      if (channel === 'update') {
        const message = JSON.parse(msg);
        const messageData = message.data;

        message.notifyChannels.map((item) => {
          this.server
            .in(item)
            .emit(
              'update',
              new UpdateEventDataDto({ ...messageData, room: item }),
            );
          this.updateResourceService.create(
            new UpdateResourceDto({ ...messageData, room: item }),
            {} as UserDto,
          );
        });
      }
    });
  }

  private Subscriber: Redis;

  private Publisher: Redis;

  @OnEvent('create')
  async handleCreateEvent(payload): Promise<void> {
    await this.Publisher.publish(
      'update',
      JSON.stringify({
        notifyChannels: payload.notifyChannels,
        data: new UpdateEventDataDto({
          data: payload.data,
          action: payload.action,
          resource: payload.resource,
          id: payload.data.id,
          message: payload.message,
          time: new Date(),
        }),
      }),
    );
  }

  @OnEvent('update')
  async handleUpdateListEvent(payload): Promise<void> {
    await this.Publisher.publish(
      'update',
      JSON.stringify({
        notifyChannels: payload.notifyChannels,
        data: new UpdateEventDataDto({
          data: payload.data,
          action: payload.action,
          resource: payload.resource,
          id: payload.data.id,
          message: payload.message,
          time: new Date(),
        }),
      }),
    );
  }

  @OnEvent('move')
  async handleMoveEvent(payload): Promise<void> {
    await this.Publisher.publish(
      'update',
      JSON.stringify({
        notifyChannels: payload.notifyChannels,
        data: new UpdateEventDataDto({
          data: payload.data,
          action: payload.action,
          resource: payload.resource,
          id: payload.data.id,
          message: payload.message,
          time: new Date(),
        }),
      }),
    );
  }

  @OnEvent('delete')
  async handleDeleteEvent(payload): Promise<void> {
    await this.Publisher.publish(
      'update',
      JSON.stringify({
        notifyChannels: payload.notifyChannels,
        data: new UpdateEventDataDto({
          data: payload.data,
          action: payload.action,
          resource: payload.resource,
          id: payload.data.id,
          message: payload.message,
          time: new Date(),
        }),
      }),
    );
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (!data.room) {
      client.emit('error', 'room not found');
    } else {
      client.rooms.has(data.room) ? null : client.join(data.room);
      client.emit('join', `you successfully joined ${data.room} room`);
    }
  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.leave(data.room);
  }
}
