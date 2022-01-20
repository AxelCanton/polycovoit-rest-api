import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entities/user.entity';
import { IS_PUBLIC_KEY } from '../roles/public.decorator';

@Injectable()
export class ValidUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();
    const userValid = user.isValid;
    console.log(userValid)
    return userValid;
  }
}
