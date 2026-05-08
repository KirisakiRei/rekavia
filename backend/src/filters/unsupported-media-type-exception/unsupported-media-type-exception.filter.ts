import { ArgumentsHost, Catch, ExceptionFilter, UnsupportedMediaTypeException } from '@nestjs/common';
import { Response } from 'express';
import { buildHttpExceptionResponse } from 'src/helpers/error-response.helper';
import { LoggerService } from 'src/logger/logger.service';

@Catch(UnsupportedMediaTypeException)
export class UnsupportedMediaTypeExceptionFilter<T> implements ExceptionFilter {

  constructor(
    private readonly logger: LoggerService
  ) {}

  catch(exception: UnsupportedMediaTypeException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const payload = buildHttpExceptionResponse(exception);

    this.logger.warn(JSON.stringify(payload.error), UnsupportedMediaTypeException.name);

    return response.status(payload.code).send(payload);

  }
}
