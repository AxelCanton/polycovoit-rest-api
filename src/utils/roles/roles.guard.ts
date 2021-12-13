import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { RoleEnum } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole: RoleEnum = this.reflector.getAllAndOverride<RoleEnum>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic || !requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole: RoleEnum = user.isAdmin ? RoleEnum.Admin : RoleEnum.User;
    return user.isAdmin || (userRole === requiredRole); // Either admin, or user with a required role user
  }
}