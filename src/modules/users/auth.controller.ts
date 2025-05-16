import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { ApiOperation } from '@nestjs/swagger';
import { Protected, Roles } from '@decorators';
import { UserRoles } from './enums';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({ summary: "Ro'yhatdan o'tish" })
  @Post('register')
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async register(@Body() payload: RegisterDto) {
    return await this.service.register(payload);
  }

  @ApiOperation({ summary: 'Profilga kirish' })
  @Post('login')
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async login(@Body() payload: LoginDto) {
    return await this.service.login(payload);
  }
}
