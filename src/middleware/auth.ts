import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.ts';
import { UnauthorizedError } from '../utils/errors.ts';

export interface JWTPayload {
  userId: string;
  role: string;
  tenantId: string | null;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
    c.set('user', decoded);
    await next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function requireRole(...allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    await next();
  };
}
