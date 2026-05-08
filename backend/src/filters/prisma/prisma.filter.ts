import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from 'generated/prisma/runtime/library';
import { buildPrismaErrorResponse } from 'src/helpers/error-response.helper';
import { LoggerService } from 'src/logger/logger.service';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError
)
export class PrismaFilter<T> implements ExceptionFilter<PrismaClientKnownRequestError | PrismaClientValidationError | PrismaClientInitializationError | PrismaClientUnknownRequestError> {

  constructor(
    private readonly logger : LoggerService
  ){}

  catch(exception: PrismaClientKnownRequestError | PrismaClientValidationError | PrismaClientInitializationError | PrismaClientUnknownRequestError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const payload = buildPrismaErrorResponse(exception);

    this.logger.error(exception.message, exception.stack, PrismaFilter.name);

    response.status(payload.code).json(payload);
  }
}
