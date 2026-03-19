import { Hono } from 'hono';
import { financeController } from './finance.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const financeRouter = new Hono();

financeRouter.use('*', authMiddleware);
financeRouter.use('*', tenantMiddleware);
financeRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));

financeRouter.get('/', (c) => financeController.findAll(c));
financeRouter.get('/:id', (c) => financeController.findById(c));
financeRouter.patch('/:id/pay', (c) => financeController.markPaid(c));

export { financeRouter };
