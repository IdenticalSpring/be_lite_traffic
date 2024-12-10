import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) ||
            this.reflector.get<string[]>('roles', context.getClass());
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new ForbiddenException('You must be logged in to access this resource');
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}
