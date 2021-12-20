import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import LoginDto from '../src/api/v1/modules/authentication/dto/login.dto';
import { plainToClass } from 'class-transformer';
import { Connection, Types } from 'mongoose';
import { MongoDbService } from '../src/shared/database/mongo/mongo-db.service';
import { UserDto } from '../src/api/v1/modules/user/dto/user.dto';
import { Collection } from '../src/common/enums/collection.enum';

// TODO fix response types
describe('ProfileController', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;

  beforeEach(async () => {
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

  it(`get profile`, async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(new UserDto({}));
  });

  it(`get notifications`, async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/profile/notification')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it(`get memberships`, async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/profile/membership')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it(`delete board memberships`, async () => {
    const membershipId = '323232323232323232333333';
    const boardMembershipId = '323232323232343333333333';

    const response = await request(app.getHttpServer())
      .delete(
        `/v1/profile/membership/${membershipId}/board/${boardMembershipId}`,
      )
      .set('Authorization', `Bearer ${accessToken}`);

    const boardMembership = await dbConnection
      .collection(Collection.BOARD_MEMBERSHIP)
      .findOne({ _id: new Types.ObjectId(boardMembershipId) });

    const membership = await dbConnection
      .collection(Collection.MEMBERSHIP)
      .findOne({ _id: new Types.ObjectId(membershipId) });

    const board = await dbConnection
      .collection(Collection.BOARD)
      .findOne({ _id: new Types.ObjectId(boardMembership.boardId) });

    expect(response.status).toBe(200);
    expect(boardMembership.deletedAt).toBeInstanceOf(Date);
    expect(
      membership.boardMembershipsId.includes(boardMembershipId),
    ).toBeFalsy();
    expect(board.boardMembershipsId.includes(boardMembershipId)).toBeFalsy();
  });

  it(`delete board memberships by wrong id`, async () => {
    const membershipId = '323232323232323232333331';
    const boardMembershipId = '323232323232343333333332';

    const response = await request(app.getHttpServer())
      .delete(
        `/v1/profile/membership/${membershipId}/board/${boardMembershipId}`,
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it(`delete memberships`, async () => {
    const membershipId = '323232323232323232333333';
    const response = await request(app.getHttpServer())
      .delete(`/v1/profile/membership/${membershipId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const membership = await dbConnection
      .collection(Collection.MEMBERSHIP)
      .findOne({ _id: new Types.ObjectId(membershipId) });

    const user = await dbConnection
      .collection(Collection.USER)
      .findOne({ _id: new Types.ObjectId(membership.userId) });

    const workspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ _id: new Types.ObjectId(membership.workspaceId) });

    expect(response.status).toBe(200);
    expect(membership.deletedAt).toBeInstanceOf(Date);
    expect(user.memberships.includes(membershipId)).toBeFalsy();
    expect(workspace.membershipsId.includes(membershipId)).toBeFalsy();
  });

  it(`delete memberships by wrong id`, async () => {
    const membershipId = '323232323232323232333331';
    const response = await request(app.getHttpServer())
      .delete(`/v1/profile/membership/${membershipId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
