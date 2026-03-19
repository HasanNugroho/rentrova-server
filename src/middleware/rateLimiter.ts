import type { Context, Next } from 'hono';
import { redis } from '../database/redis/client.ts';
import { TooManyRequestsError } from '../utils/errors.ts';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

export async function rateLimiter(c: Context, next: Next) {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const key = `rate_limit:${ip}`;

  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.pexpire(key, WINDOW_MS);
    }

    if (current > MAX_REQUESTS) {
      throw new TooManyRequestsError('Too many requests. Please try again later.');
    }

    await next();
  } catch (error) {
    if (error instanceof TooManyRequestsError) {
      throw error;
    }
    await next();
  }
}
