import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  private getClientIp(req: Request): string | undefined {
    // setelah trust proxy, req.ip sudah benar
    if (req.ip) return req.ip;

    // fallback manual (jaga-jaga)
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string') {
      return xff.split(',')[0].trim();
    }

    return undefined;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const start = Date.now();

    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = this.getClientIp(req);

    // optional (kalau pakai auth)
    const userId =
      (req as any)?.user?.sub ??
      (req as any)?.user?.id ??
      undefined;

    const userAgent = req.headers['user-agent'];

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - start;

          this.logger.log('HTTP', {
            method,
            url,
            statusCode: res.statusCode,
            durationMs,
            ip,
            userId,
            userAgent,
          });
        },
        error: (err) => {
          const durationMs = Date.now() - start;

          this.logger.error('HTTP_ERROR', {
            method,
            url,
            statusCode: res.statusCode,
            durationMs,
            ip,
            userId,
            userAgent,
            errorMessage: err?.message,
            stack: err?.stack, // boleh di prod, asal JSON
          });
        },
      }),
    );
  }
}
