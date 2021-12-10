import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/utils/roles/public.decorator';
import { jwtConstants } from './constant';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
      }
    
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);
      }

      handleRequest(err, user, info) {
        if(info instanceof TokenExpiredError) {
          throw new UnauthorizedException(jwtConstants.expiredTokenErrorMessage);
        }
        if(info instanceof JsonWebTokenError) {
          throw new UnauthorizedException(jwtConstants.malformedTokenErrorMessage);
        }

        if (err || !user) {
          throw err || new UnauthorizedException();
        }

        return user;
      }
}