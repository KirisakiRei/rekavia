import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { createDailyFolderTransport } from './daily-folder-transport';
import { createConsoleLogFormat, createFileLogFormat, filterByExactLevel } from './logger.format';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: createConsoleLogFormat(),
        }),

        createDailyFolderTransport({
          level: 'error',
          filename: 'error.log',
          format: winston.format.combine(
            filterByExactLevel('error'),
            createFileLogFormat(),
          ),
        }),

        createDailyFolderTransport({
          level: 'warn',
          filename: 'warn.log',
          format: winston.format.combine(
            filterByExactLevel('warn'),
            createFileLogFormat(),
          ),
        }),

        createDailyFolderTransport({
          level: 'debug',
          filename: 'debug.log',
          format: winston.format.combine(
            filterByExactLevel('debug'),
            createFileLogFormat(),
          ),
        }),

        createDailyFolderTransport({
          filename: 'combined.log',
          format: createFileLogFormat(),
        }),
      ],
    }),
  ],
  providers : [LoggerService],
  exports: [WinstonModule, LoggerService],
})
export class LoggerModule {}
