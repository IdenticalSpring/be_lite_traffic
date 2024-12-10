import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Decorator @Public
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
