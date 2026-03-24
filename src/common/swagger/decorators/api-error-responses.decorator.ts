import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

function createErrorSchema(options: {
  statusCode: number;
  error: string;
  messageExample: string | string[];
}) {
  const messageSchema = Array.isArray(options.messageExample)
    ? {
        type: 'array',
        items: { type: 'string' },
        example: options.messageExample,
      }
    : {
        type: 'string',
        example: options.messageExample,
      };

  return {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
      message: messageSchema,
      error: {
        type: 'string',
        example: options.error,
      },
    },
  };
}

export function ApiBadRequestErrorResponse(
  description = 'Bad Request',
  messageExample: string | string[] = 'Invalid request data',
) {
  return applyDecorators(
    ApiBadRequestResponse({
      description,
      schema: createErrorSchema({
        statusCode: 400,
        error: 'Bad Request',
        messageExample,
      }),
    }),
  );
}

export function ApiUnauthorizedErrorResponse(
  description = 'Unauthorized',
  messageExample = 'Unauthorized',
) {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description,
      schema: createErrorSchema({
        statusCode: 401,
        error: 'Unauthorized',
        messageExample,
      }),
    }),
  );
}

export function ApiForbiddenErrorResponse(
  description = 'Forbidden',
  messageExample = 'Forbidden resource',
) {
  return applyDecorators(
    ApiForbiddenResponse({
      description,
      schema: createErrorSchema({
        statusCode: 403,
        error: 'Forbidden',
        messageExample,
      }),
    }),
  );
}

export function ApiNotFoundErrorResponse(
  description = 'Not Found',
  messageExample = 'Resource not found',
) {
  return applyDecorators(
    ApiNotFoundResponse({
      description,
      schema: createErrorSchema({
        statusCode: 404,
        error: 'Not Found',
        messageExample,
      }),
    }),
  );
}

export function ApiConflictErrorResponse(
  description = 'Conflict',
  messageExample = 'Conflict',
) {
  return applyDecorators(
    ApiConflictResponse({
      description,
      schema: createErrorSchema({
        statusCode: 409,
        error: 'Conflict',
        messageExample,
      }),
    }),
  );
}