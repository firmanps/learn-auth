import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import type { Request, Response } from 'express';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { WinstonLogger } from './winston.logger';
  
  @Injectable()
  export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: WinstonLogger) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const http = context.switchToHttp();
      const req = http.getRequest<Request>();
      const res = http.getResponse<Response>();
  
      const start = Date.now();
  
      const method = req.method;
      const url = req.originalUrl || req.url;
      const ip = req.ip;
  
      // kalau kamu pakai JwtStrategy, biasanya ada req.user
      const userId = (req as any)?.user?.sub ?? (req as any)?.user?.id;
  
      return next.handle().pipe(
        tap({
          next: () => {
            const ms = Date.now() - start;
            this.logger.log('HTTP', {
              method,
              url,
              statusCode: res.statusCode,
              durationMs: ms,
              ip,
              userId,
            });
          },
          error: (err) => {
            const ms = Date.now() - start;
            this.logger.error('HTTP_ERROR', err?.stack, {
              method,
              url,
              statusCode: res.statusCode,
              durationMs: ms,
              ip,
              userId,
              errorMessage: err?.message,
            });
          },
        }),
      );
    }
  }
  