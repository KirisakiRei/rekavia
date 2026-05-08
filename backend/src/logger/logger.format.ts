import * as util from 'node:util';
import * as winston from 'winston';

type LogInfo = winston.Logform.TransformableInfo & {
  context?: string;
  trace?: string;
  stack?: string;
};

function normalizeMessage(message: unknown): string {
  if (typeof message === 'string') {
    return message;
  }

  return util.inspect(message, {
    depth: 6,
    breakLength: 120,
    compact: false,
    sorted: true,
  });
}

function normalizeValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return util.inspect(value, {
    depth: 6,
    breakLength: 120,
    compact: false,
    sorted: true,
  });
}

function collectExtraMetadata(info: LogInfo): Record<string, unknown> {
  const ignoredKeys = new Set([
    'level',
    'message',
    'timestamp',
    'context',
    'trace',
    'stack',
    Symbol.for('level') as unknown as string,
    Symbol.for('message') as unknown as string,
    Symbol.for('splat') as unknown as string,
  ]);

  const metadataEntries = Reflect.ownKeys(info)
    .filter((key) => typeof key === 'string' && !ignoredKeys.has(key))
    .map((key) => [key, info[key as keyof LogInfo]]);

  return Object.fromEntries(metadataEntries);
}

function formatLogLine(info: LogInfo, useColors = false): string {
  const timestamp = String(info.timestamp ?? '');
  const level = useColors ? info.level : info.level.toUpperCase();
  const context = info.context ? ` [${info.context}]` : '';
  const message = normalizeMessage(info.message);
  const trace = info.trace ?? info.stack;
  const metadata = collectExtraMetadata(info);
  const lines = [`[${timestamp}] ${level}${context} ${message}`];

  if (trace) {
    lines.push('Trace:');
    lines.push(normalizeValue(trace));
  }

  if (Object.keys(metadata).length > 0) {
    lines.push('Meta:');
    lines.push(normalizeValue(metadata));
  }

  return lines.join('\n');
}

export function filterByExactLevel(level: string) {
  return winston.format((info) => (info.level === level ? info : false))();
}

export function createConsoleLogFormat() {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => formatLogLine(info as LogInfo, true)),
  );
}

export function createFileLogFormat() {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.uncolorize(),
    winston.format.printf((info) => formatLogLine(info as LogInfo)),
  );
}
