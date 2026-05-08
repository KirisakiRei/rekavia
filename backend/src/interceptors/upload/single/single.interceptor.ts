import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';
import * as fs from 'fs';

type SingleFileInterceptorOptions = {
  allowedExts?: string[];
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
};

export function SingleFileInterceptor(
  fieldName: string,
  options?: SingleFileInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    private static readonly allowedExts = [
      '.jpg', '.jpeg', '.png', '.gif',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.ppt', '.pptx', '.csv',
      '.mp4', '.avi', '.mov', '.mkv',
    ];

    private static readonly allowedMimeTypes = options?.allowedMimeTypes ?? null;
    private static readonly maxFileSizeBytes = options?.maxFileSizeBytes ?? null;
    private static readonly activeAllowedExts = options?.allowedExts ?? MixinInterceptor.allowedExts;

    /**
     * Tentukan folder upload berdasarkan ekstensi file
     */
    private getUploadPath(file: Express.Multer.File): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const ext = extname(file.originalname).toLowerCase();

      let category = 'others';
      if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        category = 'images';
      } else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'].includes(ext)) {
        category = 'documents';
      } else if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
        category = 'videos';
      }

      return join(
        process.cwd(),
        'uploads',
        category,
        ext.replace('.', ''),
        `${year}`,
        `${month}`,
        `${day}`,
      );
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      const multerInterceptor = FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: (req: Request, file, cb) => {
            const uploadPath = this.getUploadPath(file);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
          },
          filename: (req: Request, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const fileExt = extname(file.originalname);
            cb(null, `${uniqueSuffix}${fileExt}`);
          },
        }),
        limits: MixinInterceptor.maxFileSizeBytes
          ? {
              fileSize: MixinInterceptor.maxFileSizeBytes,
            }
          : undefined,
        fileFilter: (req: Request, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          if (!MixinInterceptor.activeAllowedExts.includes(ext)) {
            return cb(
              new UnsupportedMediaTypeException(
                `Format file ${ext} tidak didukung untuk upload ini.`,
              ),
              false,
            );
          }

          if (
            MixinInterceptor.allowedMimeTypes &&
            !MixinInterceptor.allowedMimeTypes.includes(file.mimetype.toLowerCase())
          ) {
            return cb(
              new UnsupportedMediaTypeException(
                `Tipe file ${file.mimetype} tidak didukung untuk upload ini.`,
              ),
              false,
            );
          }

          if (
            MixinInterceptor.maxFileSizeBytes &&
            typeof file.size === 'number' &&
            file.size > MixinInterceptor.maxFileSizeBytes
          ) {
            return cb(
              new PayloadTooLargeException('Ukuran file melebihi batas upload.'),
              false,
            );
          }

          cb(null, true);
        },
      });

      const instance = new (multerInterceptor as any)();
      return instance.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
