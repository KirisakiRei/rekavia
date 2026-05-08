import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') ?? '';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const context = `HTTP ${method} ${originalUrl}`;

      const message = `${statusCode} — ${duration}ms — ${ip} — ${userAgent}`;

      if (statusCode >= 500) {
        this.logger.error(message, undefined, context);
      } else if (statusCode >= 400) {
        this.logger.warn(message, context);
      } else {
        this.logger.log(message, context);
      }
    });

    next();
  }
}
