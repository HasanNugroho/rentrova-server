import type { Context, Next } from 'hono';
import { logger } from '../../config/index.ts';

export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();
  const { method, url } = c.req;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  logger.info({
    method,
    url,
    status,
    duration: `${duration}ms`,
  });
}
