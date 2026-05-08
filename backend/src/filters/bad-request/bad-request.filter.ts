import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { buildHttpExceptionResponse } from 'src/helpers/error-response.helper';
import { LoggerService } from 'src/logger/logger.service';

@Catch(BadRequestException)
export class BadRequestFilter<T> implements ExceptionFilter<BadRequestException> {

  constructor(
    private readonly logger : LoggerService
  ) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {

    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const payload = buildHttpExceptionResponse(exception);

    this.logger.warn(JSON.stringify(payload.error), BadRequestFilter.name);

    return response.status(payload.code).send(payload);

  }
}
