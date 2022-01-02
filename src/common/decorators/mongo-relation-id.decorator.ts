/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isArray } from 'class-validator';
import { log } from 'console';

//  @Expose({ toClassOnly: true }) must be used
export const MongoRelationId = (options?: {
  fieldName: string;
}): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) =>
  applyDecorators(
    Transform(({ obj }) => {
      if (isArray(obj[options.fieldName])) {
        return obj[options.fieldName]?.map((p) => p.id);
      }
      return obj[options.fieldName]?.id;
    }) as PropertyDecorator,
  );
