import { cors } from 'hono/cors';
import { env } from '../../config/index.ts';

export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
});
