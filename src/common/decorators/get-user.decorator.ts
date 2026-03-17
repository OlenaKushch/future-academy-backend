import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export interface ActiveUserData {
  id: number;
  userId: number;
  email: string;
  role: UserRole;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ActiveUserData => {
    const { user } = ctx.switchToHttp().getRequest<{ user: ActiveUserData }>();

    return user;
  },
);
