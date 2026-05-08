import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnauthorizedException,
} from '@nestjs/common';
import { MulterError } from 'multer';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from 'generated/prisma/runtime/library';

export type ErrorResponsePayload = {
  status: 'error';
  code: number;
  message: string;
  error: string | string[] | Record<string, unknown> | unknown[];
};

type HttpExceptionResponse =
  | string
  | {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };

function ensureArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function firstErrorString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = firstErrorString(item);
      if (result) return result;
    }
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message.trim();
    }

    if (record.error) {
      return firstErrorString(record.error);
    }
  }

  return null;
}

function containsKeyword(value: string | null, keywords: string[]): boolean {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function normalizeUnauthorizedError(errors: unknown[]): string {
  const fallback = 'Username atau password salah.';
  const detail = firstErrorString(errors);

  if (
    containsKeyword(detail, ['token', 'jwt', 'expired', 'kedaluwarsa', 'session', 'sesi']) ||
    containsKeyword(detail, ['refresh'])
  ) {
    return 'Sesi login Anda tidak valid atau sudah berakhir. Silakan masuk kembali.';
  }

  if (
    containsKeyword(detail, ['password', 'akun tidak ditemukan', 'identifier']) ||
    containsKeyword(detail, ['username', 'email'])
  ) {
    return fallback;
  }

  return detail || fallback;
}

export function extractHttpExceptionErrors(exception: HttpException): unknown[] {
  const exceptionResponse = exception.getResponse() as HttpExceptionResponse;

  if (typeof exceptionResponse === 'string') {
    return [exceptionResponse];
  }

  if (Array.isArray(exceptionResponse?.message)) {
    return exceptionResponse.message;
  }

  if (exceptionResponse?.message) {
    return ensureArray(exceptionResponse.message);
  }

  if (exceptionResponse?.error) {
    return [exceptionResponse.error];
  }

  return [exception.message];
}

export function buildErrorResponse(params: {
  code: number;
  message: string;
  error: ErrorResponsePayload['error'];
}): ErrorResponsePayload {
  return {
    status: 'error',
    code: params.code,
    message: params.message,
    error: params.error,
  };
}

export function buildHttpExceptionResponse(exception: HttpException): ErrorResponsePayload {
  const code = exception.getStatus();
  const errors = extractHttpExceptionErrors(exception);

  if (exception instanceof UnauthorizedException) {
    return buildErrorResponse({
      code,
      message: containsKeyword(firstErrorString(errors), ['token', 'jwt', 'expired', 'kedaluwarsa', 'session', 'sesi'])
        ? 'Sesi login tidak valid'
        : 'Autentikasi gagal',
      error: normalizeUnauthorizedError(errors),
    });
  }

  if (exception instanceof BadRequestException) {
    return buildErrorResponse({
      code,
      message: 'Permintaan tidak valid',
      error: errors.length > 0 ? errors : 'Periksa kembali data yang dikirim.',
    });
  }

  if (exception instanceof ForbiddenException) {
    return buildErrorResponse({
      code,
      message: 'Akses ditolak',
      error: firstErrorString(errors) || 'Anda tidak memiliki izin untuk melakukan aksi ini.',
    });
  }

  if (exception instanceof NotFoundException) {
    return buildErrorResponse({
      code,
      message: 'Data tidak ditemukan',
      error: firstErrorString(errors) || 'Data yang diminta tidak tersedia.',
    });
  }

  if (exception instanceof ConflictException) {
    return buildErrorResponse({
      code,
      message: 'Terjadi konflik data',
      error: firstErrorString(errors) || 'Data yang dikirim sudah digunakan.',
    });
  }

  if (exception instanceof UnsupportedMediaTypeException) {
    return buildErrorResponse({
      code,
      message: 'Format file tidak didukung',
      error: firstErrorString(errors) || 'Gunakan format file yang didukung.',
    });
  }

  if (code === HttpStatus.TOO_MANY_REQUESTS) {
    return buildErrorResponse({
      code,
      message: 'Permintaan terlalu sering',
      error: 'Tunggu beberapa saat lalu coba lagi.',
    });
  }

  if (exception instanceof PayloadTooLargeException) {
    return buildErrorResponse({
      code,
      message: 'Ukuran file terlalu besar',
      error: firstErrorString(errors) || 'Gunakan file yang lebih kecil lalu coba lagi.',
    });
  }

  return buildErrorResponse({
    code,
    message: code >= 500 ? 'Terjadi kesalahan sistem' : 'Permintaan tidak dapat diproses',
    error: code >= 500
      ? 'Mohon coba lagi beberapa saat lagi.'
      : firstErrorString(errors) || 'Permintaan tidak dapat diproses.',
  });
}

export function buildMulterErrorResponse(exception: MulterError): ErrorResponsePayload {
  if (exception.code === 'LIMIT_FILE_SIZE') {
    return buildErrorResponse({
      code: HttpStatus.PAYLOAD_TOO_LARGE,
      message: 'Ukuran file terlalu besar',
      error: 'Ukuran file melebihi batas upload yang diizinkan.',
    });
  }

  return buildErrorResponse({
    code: HttpStatus.BAD_REQUEST,
    message: 'Upload file tidak valid',
    error: 'Periksa kembali file yang diunggah dan coba lagi.',
  });
}

function getPrismaPublicMessage(
  exception:
    | PrismaClientKnownRequestError
    | PrismaClientValidationError
    | PrismaClientInitializationError
    | PrismaClientUnknownRequestError,
): { code: number; message: string; error: string } {
  if (exception instanceof PrismaClientValidationError) {
    return {
      code: HttpStatus.BAD_REQUEST,
      message: 'Parameter permintaan tidak valid',
      error: 'Periksa kembali format data yang dikirim.',
    };
  }

  if (exception instanceof PrismaClientInitializationError) {
    return {
      code: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Layanan database belum siap',
      error: 'Mohon coba beberapa saat lagi.',
    };
  }

  if (exception instanceof PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002':
        return {
          code: HttpStatus.CONFLICT,
          message: 'Data sudah digunakan',
          error: 'Gunakan nilai lain dan coba lagi.',
        };
      case 'P2025':
        return {
          code: HttpStatus.NOT_FOUND,
          message: 'Data tidak ditemukan',
          error: 'Data yang diminta tidak tersedia.',
        };
      default:
        return {
          code: HttpStatus.BAD_REQUEST,
          message: 'Operasi database tidak dapat diproses',
          error: 'Periksa kembali data yang dikirim.',
        };
    }
  }

  return {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Terjadi kesalahan sistem',
    error: 'Mohon coba lagi beberapa saat lagi.',
  };
}

export function buildPrismaErrorResponse(
  exception:
    | PrismaClientKnownRequestError
    | PrismaClientValidationError
    | PrismaClientInitializationError
    | PrismaClientUnknownRequestError,
): ErrorResponsePayload {
  const mapped = getPrismaPublicMessage(exception);

  return buildErrorResponse({
    code: mapped.code,
    message: mapped.message,
    error: mapped.error,
  });
}

export function buildInternalErrorResponse(): ErrorResponsePayload {
  return buildErrorResponse({
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Terjadi kesalahan sistem',
    error: 'Mohon coba lagi beberapa saat lagi.',
  });
}
