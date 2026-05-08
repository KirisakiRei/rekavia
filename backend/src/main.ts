import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation/validation.pipe';
import { AppExceptionFilter, NotFoundExceptionFilter } from './filters/app-exception/app-exception.filter';
import { LoggerService } from './logger/logger.service';
import { RequestLoggerMiddleware } from './middleware/request-logger/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Matikan logger bawaan NestJS, pakai Winston
    logger: false,
  });

  // ─── CORS ────────────────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ─── Global Prefix ───────────────────────────────────────────────────────────
  // Uncomment jika ingin semua route diawali /api
  // app.setGlobalPrefix('api');

  // ─── Global Pipes ────────────────────────────────────────────────────────────
  app.useGlobalPipes(new ValidationPipe());

  // ─── Logger & Exception Filters ──────────────────────────────────────────────
  const logger = app.get(LoggerService);
  // Urutan filter: NotFound dulu (lebih spesifik), lalu catch-all
  app.useGlobalFilters(new AppExceptionFilter(logger), new NotFoundExceptionFilter());

  // ─── Request Logger Middleware ────────────────────────────────────────────────
  app.use(new RequestLoggerMiddleware(logger).use.bind(new RequestLoggerMiddleware(logger)));

  // ─── Graceful Shutdown ───────────────────────────────────────────────────────
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  logger.log(`Application running on port ${port}`, 'Bootstrap');
  logger.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
