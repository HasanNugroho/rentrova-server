import type { Context } from 'hono';
import { tenantsService } from './tenants.service.ts';
import { CreateTenantRequestSchema } from './dto/create-tenant.request.dto.ts';
import { ResponseUtil } from '../../utils/response.ts';

class TenantsController {
  async findAll(c: Context) {
    const tenants = await tenantsService.findAll();
    return c.json(ResponseUtil.success(tenants));
  }

  async findById(c: Context) {
    const id = c.req.param('id');
    const tenant = await tenantsService.findById(id);
    return c.json(ResponseUtil.success(tenant));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateTenantRequestSchema.parse(body);
    const tenant = await tenantsService.create(data);
    return c.json(ResponseUtil.success(tenant, 'Tenant created successfully'));
  }

  async suspend(c: Context) {
    const id = c.req.param('id');
    const tenant = await tenantsService.suspend(id);
    return c.json(ResponseUtil.success(tenant, 'Tenant suspended successfully'));
  }
}

export const tenantsController = new TenantsController();
