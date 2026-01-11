import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtSer, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
