import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    const url = config.getOrThrow<string>('database.url');
    const env = config.get<string>('app.nodeEnv');

    super({
      adapter: new PrismaPg({ connectionString: url }),
      log:
        env === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected');
    } catch (err) {
      this.logger.error('Database connection failed', err as any);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
