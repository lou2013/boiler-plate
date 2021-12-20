import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Collection } from '../src/common/enums/collection.enum';
import LoginDto from '../src/api/v1/modules/authentication/dto/login.dto';
import { plainToClass } from 'class-transformer';
import { LoginResponseDto } from '../src/api/v1/modules/authentication/dto/login-response.dto';
import { Connection } from 'mongoose';
import { MongoDbService } from '../src/shared/database/mongo/mongo-db.service';
import { serverErrorDto } from '../src/common/dto/server-error.dto';
import { ChangePasswordDto } from '../src/api/v1/modules/authentication/dto/change-password.dto';
import { UserDto } from '../src/api/v1/modules/user/dto/user.dto';
// TODO test response types
describe('AuthenticationController', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture
      .get<MongoDbService>(MongoDbService)
      .getDbConnection();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`login by correct credential`, async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746745',
          password: 'qwertyuiop',
        }),
      );

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(new LoginResponseDto({}));
  });

  it(`login by wrong phoneNumber`, async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746740',
          password: 'qwertyuiop',
        }),
      );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(plainToClass(serverErrorDto, {}));
  });

  it(`login by wrong password`, async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746745',
          password: 'qwertyuio',
        }),
      );

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(plainToClass(serverErrorDto, {}));
  });

  it(`login by correct credential and fcm token`, async () => {
    const phoneNumber = '09030746745';
    const password = 'qwertyuiop';
    const fcmToken =
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.weJ2aG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge';

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber,
          password,
          fcmToken,
        }),
      );

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(new LoginResponseDto({}));

    const user = await dbConnection
      .collection(Collection.USER)
      .findOne({ phoneNumber });

    expect(user.fcmTokens.includes(fcmToken)).toBeTruthy();
  });

  it(`change password by correct data`, async () => {
    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746747',
          password: 'qwertyuiop',
        }),
      );

    const response = await request(app.getHttpServer())
      .post('/v1/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(
        plainToClass(ChangePasswordDto, {
          oldPassword: 'qwertyuiop',
          newPassword: 'qwertyuio',
        }),
      );

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(new UserDto({}));

    const responseAfterChangeByOldPassword = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746747',
          password: 'qwertyuiop',
        }),
      );

    expect(responseAfterChangeByOldPassword.status).toBe(401);

    const responseAfterChangeByNewPassword = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746747',
          password: 'qwertyuio',
        }),
      );

    expect(responseAfterChangeByNewPassword.status).toBe(201);
  });

  it(`change password by wrong data`, async () => {
    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746745',
          password: 'qwertyuiop',
        }),
      );

    const response = await request(app.getHttpServer())
      .post('/v1/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(
        plainToClass(ChangePasswordDto, {
          oldPassword: 'qwertyuio',
          newPassword: 'qwertyuio',
        }),
      );

    expect(response.status).toBe(400);
  });

  it(`refresh token`, async () => {
    const {
      body: { refreshToken },
    } = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber: '09030746745',
          password: 'qwertyuiop',
        }),
      );

    const response = await request(app.getHttpServer())
      .post('/v1/auth/refresh')
      .set('refresh-token', refreshToken);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(new LoginResponseDto({}));
  });

  it(`wrong refresh token`, async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/refresh')
      .set('refresh-token', 'refreshToken');

    expect(response.status).toBe(401);
  });

  it(`refresh token with fcm token`, async () => {
    const phoneNumber = '09030746745';
    const fcmToken =
      'eyJhbGciOiJIUzI1NiIsInR5Ghw3IkpfhnA9.weJ2aG9uZU51bWJlciI6IjA5MzgxODkzODU1Iiwic3ViIjoxLCJpYXQiOjE2MzAyMTg1NTEsImV4cCI6MTYzMDMwNDk1MX0.45DQAg_UT82Y8bVBxE0ftBUyOdGvqE4k3_T7u5-afge';

    const {
      body: { refreshToken },
    } = await request(app.getHttpServer())
      .post('/v1/auth/login-by-password')
      .send(
        plainToClass(LoginDto, {
          phoneNumber,
          password: 'qwertyuiop',
        }),
      );

    const response = await request(app.getHttpServer())
      .post('/v1/auth/refresh')
      .set('refresh-token', refreshToken)
      .set('fcm-token', fcmToken);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(new LoginResponseDto({}));

    const user = await dbConnection
      .collection(Collection.USER)
      .findOne({ phoneNumber });

    expect(user.fcmTokens.includes(fcmToken)).toBeTruthy();
  });
});
