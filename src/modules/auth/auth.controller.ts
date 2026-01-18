import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';
import { JwtPayload } from 'src/common/jwt/jwt-payload.type';
import { WebResponse } from 'src/common/response/web-response.interface';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterResponse } from './dto/response/user-response';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() dto: CreateAuthDto):Promise<WebResponse<RegisterResponse>> {
    const user = await this.authService.register(dto);
  return{
    data: RegisterResponse.fromEntity(user),
    message: "Register Berhasil"
  }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() dto: LoginAuthDto,
    @Res({passthrough: true}) res: Response,
  ):Promise<WebResponse<void>> {
    const accessToken = await this.authService.login(dto);
    const isProduction = this.config.getOrThrow<string>('app.isProduction');
    const isProd = isProduction === "production"
    const maxAge = this.config.getOrThrow('jwt.accessTokenMaxAgeMs')
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return {
      message: 'Login success',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Req() req: Request){
    const userId = (req.user as JwtPayload).sub
    return this.authService.getMe(userId)
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Res({passthrough: true}) res: Response):Promise<WebResponse<void>> {
    await this.authService.logout(res)

    return{
      message: "Logout Success"
    }
  }

}
