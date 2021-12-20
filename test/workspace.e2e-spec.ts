import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import LoginDto from '../src/api/v1/modules/authentication/dto/login.dto';
import { plainToClass } from 'class-transformer';
import { Connection, Types } from 'mongoose';
import { MongoDbService } from '../src/shared/database/mongo/mongo-db.service';
import { CreateWorkspaceDto } from '../src/api/v1/modules/workspace/dto/create-workspace.dto';
import { WorkspaceVisibility } from '../src/api/v1/modules/workspace/enum/workspace-visibility.enum';
import { WorkspaceCategory } from '../src/api/v1/modules/workspace/enum/workspace-category.enum';
import { Collection } from '../src/common/enums/collection.enum';
import { UpdateWorkspaceDto } from '../src/api/v1/modules/workspace/dto/update-workspace.dto';
import { WorkspaceDto } from '../src/api/v1/modules/workspace/dto/workspace.dto';
import { UserDto } from '../src/api/v1/modules/user/dto/user.dto';

// TODO fix response types
describe('WorkspaceController', () => {
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
            phoneNumber: '09030746746',
            password: 'qwertyuiop',
          }),
        )
    ).body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it(`get workspaces`, async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/workspace')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it(`create workspaces`, async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/workspace')
      .send(
        new CreateWorkspaceDto({
          name: 'test',
          description: 'qweqweqweqwe',
          visibility: WorkspaceVisibility.PUBLIC,
          category: WorkspaceCategory.OTHER,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(201);

    const workspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ _id: new Types.ObjectId(response.body.id) });

    const membership = await dbConnection
      .collection(Collection.MEMBERSHIP)
      .findOne({ _id: new Types.ObjectId(workspace.membershipsId[0]) });

    const user = await dbConnection
      .collection(Collection.USER)
      .findOne({ _id: new Types.ObjectId(workspace.ownerId) });

    expect(membership.userId).toBe(workspace.ownerId);
    expect(membership.workspaceId).toBe(workspace._id.toString());
    expect(user.memberships).toContainEqual(membership._id);
  });

  it(`create workspaces by duplicated name`, async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/workspace')
      .send(
        new CreateWorkspaceDto({
          name: 'Walsh',
          description: 'qweqweqweqwe',
          visibility: WorkspaceVisibility.PUBLIC,
          category: WorkspaceCategory.OTHER,
        }),
      )
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it(`update workspaces with correct data`, async () => {
    const updateBody = new UpdateWorkspaceDto({
      name: 'Walsh2',
      description: '123123',
      visibility: WorkspaceVisibility.PRIVATE,
      category: WorkspaceCategory.IT,
    });

    const response = await request(app.getHttpServer())
      .patch('/v1/workspace/333232323232323232323233')
      .send(updateBody)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateBody.name);
    expect(response.body.description).toBe(updateBody.description);
    expect(response.body.visibility).toBe(updateBody.visibility);
    expect(response.body.category).toBe(updateBody.category);
  });

  it(`update workspaces with duplicated name`, async () => {
    const updateBody = new UpdateWorkspaceDto({
      name: 'test',
      description: '123123',
      visibility: WorkspaceVisibility.PRIVATE,
      category: WorkspaceCategory.IT,
    });

    const response = await request(app.getHttpServer())
      .patch('/v1/workspace/333232323232323232323233')
      .send(updateBody)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it(`join workspaces with wrong invite code`, async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/workspace/invite/qwe')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it(`join workspace by invite code with repetitious user`, async () => {
    const inviteCode = '45f4b451-0396-4944-944e-763b8f66aa33';

    const user = await dbConnection
      .collection(Collection.USER)
      .findOne({ phoneNumber: '09030746746' });

    const workspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ inviteCode });

    const response = await request(app.getHttpServer())
      .get(`/v1/workspace/invite/${inviteCode}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const newUser = await dbConnection
      .collection(Collection.USER)
      .findOne({ phoneNumber: '09030746746' });

    const newWorkspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ inviteCode });

    expect(response.status).toBe(200);
    expect(newUser.memberships.length).toEqual(user.memberships.length);
    expect(newWorkspace.membershipsId.length).toEqual(
      workspace.membershipsId.length,
    );
  });

  it(`join workspace by invite code with new user`, async () => {
    const newAccessToken = (
      await request(app.getHttpServer())
        .post('/v1/auth/login-by-password')
        .send(
          plainToClass(LoginDto, {
            phoneNumber: '09030746747',
            password: 'qwertyuio',
          }),
        )
    ).body.accessToken;

    const inviteCode = '45f4b451-0396-4944-944e-763b8f66aa33';

    const user = await dbConnection
      .collection(Collection.USER)
      .findOne({ phoneNumber: '09030746747' });

    const workspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ inviteCode });

    const response = await request(app.getHttpServer())
      .get(`/v1/workspace/invite/${inviteCode}`)
      .set('Authorization', `Bearer ${newAccessToken}`);

    const newUser = await dbConnection
      .collection(Collection.USER)
      .findOne({ phoneNumber: '09030746747' });

    const newWorkspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ inviteCode });

    expect(response.status).toBe(200);
    expect(newUser.memberships[newUser.memberships.length - 1]).toEqual(
      newWorkspace.membershipsId[newWorkspace.membershipsId.length - 1],
    );
    expect(newUser.memberships.length).toBeGreaterThan(user.memberships.length);
    expect(newWorkspace.membershipsId.length).toBeGreaterThan(
      workspace.membershipsId.length,
    );
  });

  it(`delete workspaces with wrong id`, async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/workspace/323232323232323232323230')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it(`delete workspaces with correct id`, async () => {
    const { membershipsId } = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ _id: new Types.ObjectId('333232323232323232323233') });

    const response = await request(app.getHttpServer())
      .delete('/v1/workspace/333232323232323232323233')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const workspace = await dbConnection
      .collection(Collection.WORKSPACE)
      .findOne({ _id: new Types.ObjectId('333232323232323232323233') });

    for (const _id of membershipsId) {
      const membership = await dbConnection
        .collection(Collection.MEMBERSHIP)
        .findOne({ _id });

      const user = await dbConnection
        .collection(Collection.USER)
        .findOne({ _id: new Types.ObjectId(membership.userId) });

      expect(membership.deletedAt).toBeInstanceOf(Date);
      expect(user.memberships).not.toContainEqual(_id);
      expect(workspace.membershipsId).not.toContainEqual(_id);
    }

    expect(workspace.deletedAt).toBeInstanceOf(Date);
  });
});
