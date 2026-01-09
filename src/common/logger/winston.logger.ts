import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class WinstonLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(config: ConfigService) {
    const isProd = config.getOrThrow('app.env') === 'production';

    this.logger = winston.createLogger({
      level: isProd ? 'info' : 'debug',
      transports: [
        new winston.transports.Console({
          format: isProd
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(
                  ({ level, message, timestamp, ...meta }) => {
                    const rest = Object.keys(meta).length
                      ? ` ${JSON.stringify(meta)}`
                      : '';
                    return `${timestamp} ${level}: ${message}${rest}`;
                  },
                ),
              ),
        }),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams?.[0]);
  }
  error(message: any, trace?: string, ...optionalParams: any[]) {
    this.logger.error(message, { trace, ...(optionalParams?.[0] ?? {}) });
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams?.[0]);
  }
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, optionalParams?.[0]);
  }
  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, optionalParams?.[0]);
  }
}
