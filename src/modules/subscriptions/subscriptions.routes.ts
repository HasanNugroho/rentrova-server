import { Hono } from 'hono';
import { subscriptionsController } from './subscriptions.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';

const subscriptionsRouter = new Hono();

subscriptionsRouter.use('*', authMiddleware);
subscriptionsRouter.use('*', requireRole('SUPER_ADMIN'));

subscriptionsRouter.get('/', (c) => subscriptionsController.findAll(c));
subscriptionsRouter.post('/', (c) => subscriptionsController.create(c));
subscriptionsRouter.patch('/:id', (c) => subscriptionsController.update(c));

export { subscriptionsRouter };
