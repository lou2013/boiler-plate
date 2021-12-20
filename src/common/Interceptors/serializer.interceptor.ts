import {
  ClassSerializerInterceptor,
  INestApplication,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions } from 'class-transformer';

export function SerializerInterceptor(app: INestApplication): NestInterceptor {
  return new ClassSerializerInterceptor(app.get(Reflector), serializerOptions);
}

export const serializerOptions: ClassTransformOptions = {
  strategy: 'exposeAll',
  excludeExtraneousValues: true,
  enableCircularCheck: true,
  // exposeUnsetFields: true,
  // enableImplicitConversion: true,
};
