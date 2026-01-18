import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateAuthDto) {
    const hashed = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashed,
        },
        select: {
          id: true,
          username: true,
        },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email sudah digunakan');
      }
      throw new InternalServerErrorException();
    }
  }

  async login(dto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('Email/Password anda belum terdaftar');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new BadRequestException('Email/Password anda salah');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return token;
  }

  async logout(res: Response) {
    return await res.clearCookie('token')
  }

  async getMe(userId: string){
  return await this.prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      username: true
    }
})
  }
}
