import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AppUserService } from 'src/app-user/app-user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private appUserService: AppUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const [type, data] =
      context.switchToHttp().getRequest().headers.authorization?.split(' ') ??
      [];
    const jwt = this.jwtService.decode(data);

    if (typeof jwt !== 'string' && jwt !== null) {
      const user = await this.appUserService.findOneByUserName(jwt.userName);
      const test = requiredRoles.some((role) => user.role === role);
      return test;
    }
    return false;
  }
}
