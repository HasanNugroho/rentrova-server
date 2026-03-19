import { Hono } from 'hono';
import { pricingController } from './pricing.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const pricingRouter = new Hono();

pricingRouter.use('*', authMiddleware);
pricingRouter.use('*', tenantMiddleware);

pricingRouter.post('/calculate-price', requireRole('SUPER_ADMIN', 'TENANT_OWNER', 'STAFF'), (c) =>
  pricingController.calculatePrice(c),
);

pricingRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));

pricingRouter.get('/', (c) => pricingController.findAll(c));
pricingRouter.post('/', (c) => pricingController.create(c));
pricingRouter.put('/:id', (c) => pricingController.update(c));
pricingRouter.delete('/:id', (c) => pricingController.delete(c));

export { pricingRouter };
