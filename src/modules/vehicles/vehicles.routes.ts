import { Hono } from 'hono';
import { vehiclesController } from './vehicles.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const vehiclesRouter = new Hono();

vehiclesRouter.use('*', authMiddleware);
vehiclesRouter.use('*', tenantMiddleware);
vehiclesRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF'));

vehiclesRouter.get('/', (c) => vehiclesController.findAll(c));
vehiclesRouter.get('/:id', (c) => vehiclesController.findById(c));

vehiclesRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));
vehiclesRouter.post('/', (c) => vehiclesController.create(c));
vehiclesRouter.put('/:id', (c) => vehiclesController.update(c));
vehiclesRouter.delete('/:id', (c) => vehiclesController.delete(c));

export { vehiclesRouter };
