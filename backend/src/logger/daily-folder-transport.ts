// daily-folder-transport.ts
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import * as winston from 'winston';
import { getLogsRootDir, getTodayLogDir } from './logger.utils';

export function createDailyFolderTransport(options: {
  level?: string;
  filename: string;
  format?: winston.Logform.Format;
}) {
  return new DailyRotateFile({
    level: options.level,
    dirname: getTodayLogDir(),
    filename: options.filename,
    datePattern: 'YYYY-MM-DD',
    format: options.format,
    createSymlink: false,
    auditFile: path.join(getLogsRootDir(), `.audit-${options.filename}.json`),
  });
}
