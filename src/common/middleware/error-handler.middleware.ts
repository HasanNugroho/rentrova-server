import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { logger } from '../../config/index.ts';
import { ResponseUtil } from '../utils/response.util.ts';
import { HttpStatus } from '../constants/index.ts';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    logger.error('Error caught by error handler:', error);

    if (error instanceof HTTPException) {
      const status = error.status;
      return c.json(ResponseUtil.error(error.message, status), status);
    }

    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      return c.json(
        ResponseUtil.badRequest('Validation failed', errors),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (error instanceof Error) {
      return c.json(
        ResponseUtil.internalError(error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return c.json(
      ResponseUtil.internalError('An unexpected error occurred'),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
