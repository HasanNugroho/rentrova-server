import { Hono } from 'hono';
import { customersController } from './customers.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const customersRouter = new Hono();

customersRouter.use('*', authMiddleware);
customersRouter.use('*', tenantMiddleware);
customersRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF'));

customersRouter.get('/', (c) => customersController.findAll(c));
customersRouter.post('/', (c) => customersController.create(c));
customersRouter.get('/:id', (c) => customersController.findById(c));

customersRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));
customersRouter.put('/:id', (c) => customersController.update(c));

export { customersRouter };
