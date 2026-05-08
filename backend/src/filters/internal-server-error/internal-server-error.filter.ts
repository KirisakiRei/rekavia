import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { buildInternalErrorResponse } from 'src/helpers/error-response.helper';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const payload = buildInternalErrorResponse();

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack, InternalServerErrorFilter.name);
    } else {
      this.logger.error(String(exception), undefined, InternalServerErrorFilter.name);
    }

    return response.status(payload.code).send(payload);
  }
}
