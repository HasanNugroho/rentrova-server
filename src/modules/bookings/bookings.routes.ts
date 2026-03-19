import { Hono } from 'hono';
import { bookingsController } from './bookings.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const bookingsRouter = new Hono();

bookingsRouter.use('*', authMiddleware);
bookingsRouter.use('*', tenantMiddleware);
bookingsRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF'));

bookingsRouter.get('/', (c) => bookingsController.findAll(c));
bookingsRouter.post('/', (c) => bookingsController.create(c));
bookingsRouter.get('/:id', (c) => bookingsController.findById(c));
bookingsRouter.patch('/:id/status', (c) => bookingsController.updateStatus(c));

export { bookingsRouter };
