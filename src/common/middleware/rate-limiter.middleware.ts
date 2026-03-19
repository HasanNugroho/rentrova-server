import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { redisService } from '../../database/index.ts';
import { env } from '../../config/index.ts';
import { HttpStatus } from '../constants/index.ts';

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (c: Context) => string;
}

export function rateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs || env.RATE_LIMIT_WINDOW_MS;
  const maxRequests = options.maxRequests || env.RATE_LIMIT_MAX_REQUESTS;
  const keyGenerator = options.keyGenerator || ((c: Context) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    return `rate-limit:${ip}`;
  });

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const current = await redisService.get<number>(key);

    if (current && current >= maxRequests) {
      const ttl = await redisService.ttl(key);
      throw new HTTPException(HttpStatus.TOO_MANY_REQUESTS, {
        message: `Too many requests. Please try again in ${ttl} seconds.`,
      });
    }

    if (current) {
      await redisService.incr(key);
    } else {
      await redisService.set(key, 1, Math.floor(windowMs / 1000));
    }

    await next();
  };
}
