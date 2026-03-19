import { Hono } from 'hono';
import { maintenanceController } from './maintenance.controller.ts';
import { authMiddleware, requireRole } from '../../middleware/auth.ts';
import { tenantMiddleware } from '../../middleware/tenant.ts';

const maintenanceRouter = new Hono();

maintenanceRouter.use('*', authMiddleware);
maintenanceRouter.use('*', tenantMiddleware);
maintenanceRouter.use('*', requireRole('SUPER_ADMIN', 'TENANT_OWNER'));

maintenanceRouter.get('/', (c) => maintenanceController.findAll(c));
maintenanceRouter.post('/', (c) => maintenanceController.create(c));
maintenanceRouter.get('/:id', (c) => maintenanceController.findById(c));

export { maintenanceRouter };
