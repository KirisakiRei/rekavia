import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { buildHttpExceptionResponse } from 'src/helpers/error-response.helper';
import { LoggerService } from 'src/logger/logger.service';

@Catch(UnauthorizedException)
export class UnauthorizedFilter<T> implements ExceptionFilter<UnauthorizedException> {

  constructor(
    private readonly logger : LoggerService
  ){}

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const payload = buildHttpExceptionResponse(exception);

    this.logger.warn(JSON.stringify(payload.error), UnauthorizedFilter.name);

    return response.status(payload.code).send(payload);
  }
}
