import type { Context } from 'hono';
import { driversService } from './drivers.service.ts';
import { CreateDriverRequestSchema } from './dto/create-driver.request.dto.ts';
import { UpdateDriverRequestSchema } from './dto/update-driver.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';
import { ForbiddenError } from '../../utils/errors.ts';

class DriversController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const drivers = await driversService.findAll(tenantId);
    return c.json(ResponseUtil.success(drivers));
  }

  async findById(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const driver = await driversService.findById(id, tenantId);
    return c.json(ResponseUtil.success(driver));
  }

  async getSchedule(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const user = c.get('user');

    if (user.role === 'DRIVER') {
      const driver = await driversService.findById(id, tenantId);
      if (!driver) {
        throw new ForbiddenError('Access denied');
      }
    }

    const schedule = await driversService.getSchedule(id, tenantId, user.userId);
    return c.json(ResponseUtil.success(schedule));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateDriverRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const driver = await driversService.create(data, tenantId);
    return c.json(ResponseUtil.success(driver, 'Driver created successfully'));
  }

  async update(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdateDriverRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const driver = await driversService.update(id, data, tenantId);
    return c.json(ResponseUtil.success(driver, 'Driver updated successfully'));
  }
}

export const driversController = new DriversController();
