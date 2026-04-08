import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

export interface SuccessResponse<T> {
  status: 'success';
  message: string;
  data: T;
}

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T | null>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T | null>> {
    const defaultMessage =
      this.reflector.getAllAndOverride<string>(SUCCESS_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Request successful';

    return next.handle().pipe(
      map(payload => {
        if (
          payload &&
          typeof payload === 'object' &&
          'status' in (payload as Record<string, unknown>) &&
          (payload as { status?: unknown }).status === 'success'
        ) {
          const normalizedPayload = payload as Record<string, unknown>;
          const message = normalizedPayload.message;
          const rest = Object.fromEntries(
            Object.entries(normalizedPayload).filter(
              ([key]) => key !== 'status' && key !== 'message',
            ),
          );

          return {
            status: 'success' as const,
            message:
              typeof message === 'string' && message.length > 0
                ? message
                : defaultMessage,
            data: Object.keys(rest).length > 0 ? (rest as T) : null,
          };
        }

        return {
          status: 'success' as const,
          message: defaultMessage,
          data: payload ?? null,
        };
      }),
    );
  }
}
