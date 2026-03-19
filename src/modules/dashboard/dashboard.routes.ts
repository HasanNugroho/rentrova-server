import { Hono } from 'hono';
import { dashboardController } from './dashboard.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const dashboardRouter = new Hono();

dashboardRouter.use('*', authMiddleware);

dashboardRouter.get(
  '/',
  tenantMiddleware,
  requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF'),
  (c) => dashboardController.getTenantDashboard(c),
);

dashboardRouter.get('/admin', requireRole('SUPER_ADMIN'), (c) => dashboardController.getAdminDashboard(c));

export { dashboardRouter };
