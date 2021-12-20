import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import LoginDto from '../src/api/v1/modules/authentication/dto/login.dto';
import { plainToClass } from 'class-transformer';
import { Connection, Types } from 'mongoose';
import { MongoDbService } from '../src/shared/database/mongo/mongo-db.service';
import { MoveCardDto } from '../src/api/v1/modules/card/dto/move-card.dto';
import { LexoRank } from 'lexorank';
import { Collection } from '../src/common/enums/collection.enum';
import { MoveListDto } from '../src/api/v1/modules/list/dto/move-list.dto';

// TODO fix response types
describe('changePosition', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture
      .get<MongoDbService>(MongoDbService)
      .getDbConnection();
    accessToken = (
      await request(app.getHttpServer())
        .post('/v1/auth/login-by-password')
        .send(
          plainToClass(LoginDto, {
            phoneNumber: '09030746745',
            password: 'qwertyuiop',
          }),
        )
    ).body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it(`move list to top of list array`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353536';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/move`,
      )
      .send(plainToClass(MoveListDto, { prevPosition: '0' }))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.min().between(LexoRank.min().genNext()).format(),
    );
  });

  it(`move list to end of the list array`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353536';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/move`,
      )
      .send(plainToClass(MoveListDto, { prevPosition: '0|100000:' }))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.parse('0|100000:').genNext().format(),
    );
  });

  it(`move list with wrong listId`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353530';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/move`,
      )
      .send(plainToClass(MoveListDto, { prevPosition: '0' }))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it(`move list with wrong prevPosition`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353530';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/move`,
      )
      .send(plainToClass(MoveListDto, { prevPosition: '0|000000:' }))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it(`move card to top of its own list`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363632';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(plainToClass(MoveCardDto, {}))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.min().between(LexoRank.min().genNext()).format(),
    );
  });

  it(`move card between two cards in its own list`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363632';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(plainToClass(MoveCardDto, { prevPosition: '0|100000:' }))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.parse('0|100000:').between(LexoRank.parse('0|10000g:')).format(),
    );
  });

  it(`move card to end of the its own list`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363631';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(plainToClass(MoveCardDto, { prevPosition: '0|10000g:' }))
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.parse('0|10000g:').genNext().format(),
    );
  });

  it(`move card to top of the other list`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363633';
    const destinationListId = '343434343434343535353536';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(
        plainToClass(MoveCardDto, {
          destinationListId,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.min().between(LexoRank.min().genNext()).format(),
    );

    const firstList = (
      await dbConnection
        .collection(Collection.BOARD)
        .findOne({ _id: new Types.ObjectId(boardId) })
    ).lists.find((item) => item._id.toString() === listId);

    expect(
      firstList.cardsId.find((item) => item.toString() === cardId),
    ).toBeFalsy();

    const destList = (
      await dbConnection
        .collection(Collection.BOARD)
        .findOne({ _id: new Types.ObjectId(boardId) })
    ).lists.find((item) => item._id.toString() === destinationListId);

    expect(
      destList.cardsId.find((item) => item.toString() === cardId),
    ).toBeTruthy();
  });

  it(`move card card between two cards in other list`, async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363631';
    const destinationListId = '343434343434343535353536';
    const prevPosition = '0|100000:';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(
        plainToClass(MoveCardDto, {
          destinationListId,
          prevPosition,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.position).toBe(
      LexoRank.parse(prevPosition)
        .between(LexoRank.parse(prevPosition).genNext())
        .format(),
    );

    const firstList = (
      await dbConnection
        .collection(Collection.BOARD)
        .findOne({ _id: new Types.ObjectId(boardId) })
    ).lists.find((item) => item._id.toString() === listId);

    expect(
      firstList.cardsId.find((item) => item.toString() === cardId),
    ).toBeFalsy();

    const destList = (
      await dbConnection
        .collection(Collection.BOARD)
        .findOne({ _id: new Types.ObjectId(boardId) })
    ).lists.find((item) => item._id.toString() === destinationListId);

    expect(
      destList.cardsId.find((item) => item.toString() === cardId),
    ).toBeTruthy();
  });

  it('move card by wrong cardId', async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363630';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it('move card by wrong listId', async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353538';
    const cardId = '363636363636363636363631';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it('move card by wrong destinationListId', async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363630';
    const destinationListId = '343434343434343535353530';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(
        plainToClass(MoveCardDto, {
          destinationListId,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it('move card by correct destinationListId and wrong prevPosition', async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363630';
    const destinationListId = '343434343434343535353530';
    const prevPosition = '0|000000:';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(
        plainToClass(MoveCardDto, {
          destinationListId,
          prevPosition,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it('move card by wrong prevPosition', async () => {
    const workspaceId = '333232323332323232323233';
    const boardId = '373837383738373837383738';
    const listId = '343434343434343535353535';
    const cardId = '363636363636363636363630';
    const prevPosition = '0|000000:';

    const response = await request(app.getHttpServer())
      .patch(
        `/v1/workspace/${workspaceId}/board/${boardId}/list/${listId}/card/${cardId}/move`,
      )
      .send(
        plainToClass(MoveCardDto, {
          prevPosition,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
