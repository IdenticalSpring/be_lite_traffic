import { SetMetadata } from '@nestjs/common';

// Key dùng để lưu metadata vai trò
export const ROLES_KEY = 'roles';

// Decorator @Roles để gắn metadata vai trò vào handler
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
