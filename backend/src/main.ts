import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation/validation.pipe';
import { AppExceptionFilter } from './filters/app-exception/app-exception.filter';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())

  const logger = app.get(LoggerService);

  app.useGlobalFilters(new AppExceptionFilter(logger))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
