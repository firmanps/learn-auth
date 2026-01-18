import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const origin = configService.getOrThrow<string[]>('app.corsOrigins');

  //logger
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

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
