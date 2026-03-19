import type { Context } from 'hono';
import { customersService } from './customers.service.ts';
import { CreateCustomerRequestSchema } from './dto/create-customer.request.dto.ts';
import { UpdateCustomerRequestSchema } from './dto/update-customer.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class CustomersController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const customers = await customersService.findAll(tenantId);
    return c.json(ResponseUtil.success(customers));
  }

  async findById(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const customer = await customersService.findById(id, tenantId);
    return c.json(ResponseUtil.success(customer));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateCustomerRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const customer = await customersService.create(data, tenantId);
    return c.json(ResponseUtil.success(customer, 'Customer created successfully'));
  }

  async update(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdateCustomerRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const customer = await customersService.update(id, data, tenantId);
    return c.json(ResponseUtil.success(customer, 'Customer updated successfully'));
  }
}

export const customersController = new CustomersController();
