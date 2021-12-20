import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { isDefined, ValidationError } from 'class-validator';

export const GlobalValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: function (errors) {
    return new BadRequestException(
      errors.map((error) => {
        try {
          return {
            property: error.property,
            errors: Object.values(error.constraints),
            error: error,
          };
        } catch (err) {
          return {
            property: error.property,
            errors: isDefined(error.children as unknown as ValidationError[])
              ? error.children
                  .map((v) =>
                    v.children.map((v) => Object.values(v.constraints)),
                  )
                  .reduce((accumulator, value) => accumulator.concat(value), [])
              : ['undefined error'],
          };
        }
      }),
    );
  },
  transformOptions: { enableImplicitConversion: true },
});
