import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ActiveUserData {
  id: number;
  userId: number;
  email: string;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ActiveUserData => {
    const { user } = ctx.switchToHttp().getRequest<{ user: ActiveUserData }>();

    return user;
  },
);
