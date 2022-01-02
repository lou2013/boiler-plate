/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isArray } from 'class-validator';
import { Types } from 'mongoose';

// @Expose({ toPlainOnly: true }) must be used
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

      if (obj[options.idFieldName])
        return new (options.dto())(
          typeof obj[options.idFieldName] === 'string'
            ? { id: obj[options.idFieldName] }
            : obj[options.idFieldName],
        );
    }) as PropertyDecorator,
  );
};
