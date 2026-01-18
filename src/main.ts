import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { WinstonLogger } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const origin = configService.getOrThrow<string[]>('app.corsOrigins');

  //logger
  const logger = app.get(WinstonLogger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));

  //cookie-parser
  app.use(cookieParser());

  //cors
  app.enableCors({
    origin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //hapus field yang tidak ada di dto
      forbidNonWhitelisted: true, //error jika ada field asing
      transform: true //auto transform ke dto class
    })
  )

  //prefix endpoint
  app.setGlobalPrefix('/api');

  await app.listen(port);
}
bootstrap();
