import { PROTECTED_KEY } from '@decorators';
import { JwtHelper } from '@helpers';
import { UserRoles } from '@modules';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtHelper: JwtHelper,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (!isProtected) {
      request.role = UserRoles.USER;
      return true;
    }

    const token = request.headers['authorization'];

    if (!token || !token.startsWith('Bearer')) {
      throw new BadRequestException('Iltimos Bearer token yuboring');
    }

    const data = await this.jwtHelper.verifyToken(token.split(' ')[1]);

    request.role = data.role;
    request.userId = data.id;
    return true;
  }
}
