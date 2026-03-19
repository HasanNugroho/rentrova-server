import { Hono } from 'hono';
import { tenantsController } from './tenants.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';

const tenantsRouter = new Hono();

tenantsRouter.use('*', authMiddleware);
tenantsRouter.use('*', requireRole('SUPER_ADMIN'));

tenantsRouter.get('/', (c) => tenantsController.findAll(c));
tenantsRouter.post('/', (c) => tenantsController.create(c));
tenantsRouter.get('/:id', (c) => tenantsController.findById(c));
tenantsRouter.patch('/:id/suspend', (c) => tenantsController.suspend(c));

export { tenantsRouter };
