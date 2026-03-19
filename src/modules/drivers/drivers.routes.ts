import { Hono } from 'hono';
import { driversController } from './drivers.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const driversRouter = new Hono();

driversRouter.use('*', authMiddleware);
driversRouter.use('*', tenantMiddleware);

driversRouter.get(
  '/:id/schedule',
  requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF', 'DRIVER'),
  (c) => driversController.getSchedule(c),
);

driversRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF'));

driversRouter.get('/', (c) => driversController.findAll(c));
driversRouter.get('/:id', (c) => driversController.findById(c));

driversRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));
driversRouter.post('/', (c) => driversController.create(c));
driversRouter.put('/:id', (c) => driversController.update(c));

export { driversRouter };
