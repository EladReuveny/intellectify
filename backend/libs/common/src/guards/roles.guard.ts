import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'apps/users-service/src/enums/role.enum';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../types/JwtPayload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authorizedRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!authorizedRoles) {
      return true;
    }

    const user: JwtPayload = context.switchToHttp().getRequest<Request>()[
      'user'
    ];

    if (!user || !authorizedRoles.includes(user.role as Role)) {
      throw new ForbiddenException(
        "Access Denied. You don't have the right permissions to access this resource",
      );
    }

    return true;
  }
}
