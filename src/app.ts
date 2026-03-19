import { Hono } from 'hono';
import { logger } from './config/index.ts';
import { corsMiddleware, errorHandler, requestLogger, rateLimiter } from './common/middleware/index.ts';
import { authRouter } from './modules/auth/auth.route.ts';
import { userRouter } from './modules/user/user.route.ts';
import { setupSwagger } from './docs/swagger.ts';
import { ResponseUtil } from './common/utils/response.util.ts';

const app = new Hono();

app.use('*', corsMiddleware);
app.use('*', requestLogger);
app.use('*', errorHandler);

app.get('/', (c) => {
  return c.json(
    ResponseUtil.success(
      {
        name: 'Rentrova Server API',
        version: '1.0.0',
        status: 'running',
      },
      'Welcome to Rentrova Server API',
    ),
  );
});

app.get('/health', (c) => {
  return c.json(
    ResponseUtil.success(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      'Service is healthy',
    ),
  );
});

setupSwagger(app);

app.use('/api/v1/*', rateLimiter());

app.route('/api/v1/auth', authRouter);
app.route('/api/v1/users', userRouter);

app.notFound((c) => {
  return c.json(ResponseUtil.notFound('Route not found'), 404);
});

logger.info('✅ Application initialized successfully');

export default app;
