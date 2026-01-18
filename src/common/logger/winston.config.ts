import * as winston from 'winston';

export function buildWinstonOptions(env: string): winston.LoggerOptions {
  const isProd = env === 'production';

  return {
    level: isProd ? 'info' : 'debug',
    format: isProd
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const rest = Object.keys(meta).length
              ? ` ${JSON.stringify(meta)}`
              : '';
            return `${timestamp} ${level}: ${message}${rest}`;
          }),
        ),
    transports: [new winston.transports.Console()],
  };
}
