import { Hono } from 'hono';
import { usersController } from './users.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const usersRouter = new Hono();

usersRouter.use('*', authMiddleware);
usersRouter.use('*', tenantMiddleware);
usersRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));

usersRouter.get('/', (c) => usersController.findAll(c));
usersRouter.post('/', (c) => usersController.create(c));
usersRouter.put('/:id', (c) => usersController.updateRole(c));
usersRouter.delete('/:id', (c) => usersController.delete(c));

export { usersRouter };
