import type { Context } from 'hono';
import { maintenanceService } from './maintenance.service.ts';
import { CreateMaintenanceRequestSchema } from './dto/create-maintenance.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class MaintenanceController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const logs = await maintenanceService.findAll(tenantId);
    return c.json(ResponseUtil.success(logs));
  }

  async findById(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const log = await maintenanceService.findById(id, tenantId);
    return c.json(ResponseUtil.success(log));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateMaintenanceRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const log = await maintenanceService.create(data, tenantId);
    return c.json(ResponseUtil.success(log, 'Maintenance log created successfully'));
  }
}

export const maintenanceController = new MaintenanceController();
