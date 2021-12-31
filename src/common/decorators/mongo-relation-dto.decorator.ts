/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isArray } from 'class-validator';
import { Types } from 'mongoose';

export const MongoRelationDto = (options?: {
  idFieldName: string;
  dto: () => new (obj: Record<string, unknown>) => unknown;
}): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) => {
  return applyDecorators(
    Transform(({ obj }) => {
      if (isArray(obj[options.idFieldName]))
        return obj[options.idFieldName]?.map((p) => {
          return new (options.dto())(
            p instanceof Types.ObjectId ? { id: p.toString() } : p,
          );
        });
      if (obj[options.idFieldName]) {
        console.log(obj[options.idFieldName] instanceof String);

        const d = new (options.dto())(
          obj[options.idFieldName] instanceof Types.ObjectId ||
          obj[options.idFieldName] instanceof String
            ? { id: obj[options.idFieldName] }
            : obj[options.idFieldName],
        );
        console.log(d);

        return d;
      }
    }) as PropertyDecorator,
  );
};
