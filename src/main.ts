import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { WinstonLogger } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const origin = configService.getOrThrow<string[]>('cors.origins');

  //logger
  const logger = app.get(WinstonLogger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));

  //cors
  app.enableCors({
    origin,
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
