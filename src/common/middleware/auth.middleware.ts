import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { JwtUtil, type JwtPayload } from '../utils/jwt.util.ts';
import { HttpStatus } from '../constants/index.ts';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.substring(7);

  try {
    const payload = JwtUtil.verifyAccessToken(token);
    c.set('user', payload);
    await next();
  } catch (error) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: 'Invalid or expired token',
    });
  }
}

export async function optionalAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = JwtUtil.verifyAccessToken(token);
      c.set('user', payload);
    } catch (error) {
      // Silently fail for optional auth
    }
  }

  await next();
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as JwtPayload | undefined;

    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: 'Authentication required',
      });
    }

    if (!roles.includes(user.role)) {
      throw new HTTPException(HttpStatus.FORBIDDEN, {
        message: 'Insufficient permissions',
      });
    }

    await next();
  };
}
