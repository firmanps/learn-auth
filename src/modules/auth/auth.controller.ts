import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/zod/zod-validation.pipe';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateAuthSchema } from './dto/create-auth.dto';
import { LoginAuthDto, LoginAuthSchema } from './dto/login-auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  register(@Body(new ZodValidationPipe(CreateAuthSchema)) dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body(new ZodValidationPipe(LoginAuthSchema)) dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Post('/logout')
  logout() {}
}
