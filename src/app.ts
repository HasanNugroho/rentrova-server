import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { ZodError } from 'zod';
import { env } from './config/env.config.ts';
import { logger } from './config/logger.config.ts';
import { AppError } from './utils/errors.ts';
import { ResponseUtil } from './utils/response.ts';
import { rateLimiter } from './middleware/rateLimiter.ts';

import { authRouter } from './modules/auth/auth.routes.ts';
import { tenantsRouter } from './modules/tenants/tenants.routes.ts';
import { vehiclesRouter } from './modules/vehicles/vehicles.routes.ts';
import { customersRouter } from './modules/customers/customers.routes.ts';
import { driversRouter } from './modules/drivers/drivers.routes.ts';
import { bookingsRouter } from './modules/bookings/bookings.routes.ts';
import { pricingRouter } from './modules/pricing/pricing.routes.ts';
import { financeRouter } from './modules/finance/finance.routes.ts';
import { maintenanceRouter } from './modules/maintenance/maintenance.routes.ts';
import { usersRouter } from './modules/users/users.routes.ts';
import { subscriptionsRouter } from './modules/subscriptions/subscriptions.routes.ts';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.ts';
import { setupSwagger } from './docs/swagger.ts';

const app = new Hono();

app.use('*', honoLogger());
app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN.split(','),
    credentials: true,
  }),
);
app.use('*', rateLimiter);

app.get('/', (c) => {
  return c.json({
    message: 'Rentrova - Multi-Tenant Vehicle Rental SaaS API',
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
});

app.route('/auth', authRouter);
app.route('/tenants', tenantsRouter);
app.route('/vehicles', vehiclesRouter);
app.route('/customers', customersRouter);
app.route('/drivers', driversRouter);
app.route('/bookings', bookingsRouter);
app.route('/pricing-rules', pricingRouter);
app.route('/transactions', financeRouter);
app.route('/maintenance', maintenanceRouter);
app.route('/users', usersRouter);
app.route('/subscriptions', subscriptionsRouter);
app.route('/dashboard', dashboardRouter);

setupSwagger(app);

app.onError((err, c) => {
  logger.error('Error caught:', err);

  if (err instanceof AppError) {
    return c.json(ResponseUtil.error(err.message, err.code), err.statusCode);
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return c.json(ResponseUtil.error(errors.join(', '), 'VALIDATION_ERROR'), 400);
  }

  if (err instanceof Error) {
    return c.json(ResponseUtil.error(err.message, 'INTERNAL_ERROR'), 500);
  }

  return c.json(ResponseUtil.error('An unexpected error occurred', 'UNKNOWN_ERROR'), 500);
});

logger.info('✅ Rentrova Multi-Tenant SaaS API initialized successfully');

export default app;
