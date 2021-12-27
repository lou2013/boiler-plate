/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isArray } from 'class-validator';
import { Types } from 'mongoose';

export const MongoRelationDto = (options?: {
  idFieldName: string;
}): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) =>
  applyDecorators(
    Transform(({ obj }) => {
      if (isArray(obj[options.idFieldName]))
        return obj[options.idFieldName]?.map((p) => {
          p instanceof Types.ObjectId ? p.toHexString() : p;
        });
      return obj[options.idFieldName] instanceof Types.ObjectId
        ? obj[options.idFieldName].toHexString()
        : obj[options.idFieldName];
    }) as PropertyDecorator,
  );
