import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from 'generated/prisma/runtime/library';
import { MulterError } from 'multer';
import {
  buildHttpExceptionResponse,
  buildInternalErrorResponse,
  buildMulterErrorResponse,
  buildPrismaErrorResponse,
  buildErrorResponse,
} from 'src/helpers/error-response.helper';
import { LoggerService } from 'src/logger/logger.service';

type PrismaException =
  | PrismaClientKnownRequestError
  | PrismaClientValidationError
  | PrismaClientInitializationError
  | PrismaClientUnknownRequestError;

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  private isPrismaException(exception: unknown): exception is PrismaException {
    return (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientValidationError ||
      exception instanceof PrismaClientInitializationError ||
      exception instanceof PrismaClientUnknownRequestError
    );
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    // Guard: jika response sudah dikirim (misal pakai @Res() manual), jangan kirim lagi
    if (response.headersSent) {
      return;
    }

    const context = `${request.method} ${request.originalUrl}`;

    // ── Prisma Errors ──────────────────────────────────────────────────────────
    if (this.isPrismaException(exception)) {
      const payload = buildPrismaErrorResponse(exception);
      this.logger.error(exception.message, exception.stack, `Prisma ${context}`);
      return response.status(payload.code).json(payload);
    }

    // ── HTTP Exceptions ────────────────────────────────────────────────────────
    if (exception instanceof HttpException) {
      const payload = buildHttpExceptionResponse(exception);
      const level = payload.code >= HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : 'warn';
      const detail = Array.isArray(payload.error) ? payload.error.join('; ') : String(payload.error);

      if (level === 'error') {
        this.logger.error(detail, exception.stack, `HTTP ${payload.code} ${context}`);
      } else {
        this.logger.warn(`${payload.code} ${detail}`, `HTTP ${context}`);
      }

      return response.status(payload.code).json(payload);
    }

    // ── Multer Errors ──────────────────────────────────────────────────────────
    if (exception instanceof MulterError) {
      const payload = buildMulterErrorResponse(exception);
      const detail = Array.isArray(payload.error) ? payload.error.join('; ') : String(payload.error);
      this.logger.warn(`${payload.code} ${detail}`, `Upload ${context}`);
      return response.status(payload.code).json(payload);
    }

    // ── Unknown / Unhandled Errors ─────────────────────────────────────────────
    const payload = buildInternalErrorResponse();

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack, `Unhandled ${context}`);
    } else {
      this.logger.error(String(exception), undefined, `Unhandled ${context}`);
    }

    return response.status(payload.code).json(payload);
  }
}

/**
 * Filter khusus untuk menangkap route yang tidak ditemukan (404).
 * Dipasang terpisah agar bisa memberikan pesan yang lebih informatif.
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    if (response.headersSent) {
      return;
    }

    const payload = buildErrorResponse({
      code: HttpStatus.NOT_FOUND,
      message: 'Endpoint tidak ditemukan',
      error: `Route ${request.method} ${request.originalUrl} tidak tersedia.`,
    });

    return response.status(HttpStatus.NOT_FOUND).json(payload);
  }
}
