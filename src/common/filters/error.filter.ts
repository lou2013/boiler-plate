/* eslint-disable @typescript-eslint/no-explicit-any */ import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { DatabaseError, ValidationError } from 'sequelize';
import { isString } from 'class-validator';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Inject } from '@nestjs/common';
import { ErrorService } from '../../api/v1/modules/error/service/error.service';
import { ErrorDto } from 'src/api/v1/modules/error/dto/error.dto';
import { UserDto } from 'src/api/v1/modules/user/dto/user.dto';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    @InjectSentry() private readonly sentryClient: SentryService,
    @Inject(ErrorService) private readonly errorService: ErrorService,
  ) {}

  catch(error: unknown, host: ArgumentsHost) {
    let status: number;
    let message: string;
    let fields;
    let source = 'unknown.unknown';
    if ((error as any)?.stack?.split('\n')[1]?.split(' at ')[1]?.split('(')[0])
      source = (error as any).stack
        .split('\n')[1]
        .split(' at ')[1]
        .split('(')[0]
        .trim();

    status = (error as any).status;
    const sourceClass = source.split('.')[0];
    const sourceMethod = source.split('.')[1];

    if (error instanceof BadRequestException) {
      status = error.getStatus();
      const response = error.getResponse() as { message: any };
      if (isString(response.message)) {
        message = response.message;
      } else {
        message = 'validation error';
        fields = (error.getResponse() as { message: any })?.message;
      }
    } else if (error instanceof HttpException) {
      status = error.getStatus();
      message = error.message;
    } else if (error instanceof DatabaseError) {
      status = HttpStatus.BAD_REQUEST;
      message = error.message;
    } else if (error instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = error.message;
      fields = error.errors.map((field) => {
        return { property: field.path, errors: [field.message] };
      });
      // fields = (error.getResponse() as { message:})
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      this.sentryClient.error(message, '', '');
    }

    if (status.toString().startsWith('5')) {
      this.errorService
        .create(
          new ErrorDto({
            message,
            status,
            stack: (error as any).stack,
            sourceClass,
            sourceMethod,
          }),
          {} as UserDto,
        )
        .then((res) => {
          this.logger.error(
            `a new internal error with mongo id ${res.id} was added`,
            '',
            '',
          );
        })
        .catch((err) => {
          this.logger.error(
            `saving error was unsuccefull error message : ${err.message}`,
            '',
            '',
          );
        });
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    this.logger.error(error);
    response.status(status).json({
      serverError: {
        status: status,
        message: message,
        fields: fields,
        // error: error,
      },
    });
  }
}
