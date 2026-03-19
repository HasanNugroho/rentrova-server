import type { Context } from 'hono';
import { vehiclesService } from './vehicles.service.ts';
import { CreateVehicleRequestSchema } from './dto/create-vehicle.request.dto.ts';
import { UpdateVehicleRequestSchema } from './dto/update-vehicle.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class VehiclesController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const vehicles = await vehiclesService.findAll(tenantId);
    return c.json(ResponseUtil.success(vehicles));
  }

  async findById(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const vehicle = await vehiclesService.findById(id, tenantId);
    return c.json(ResponseUtil.success(vehicle));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateVehicleRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const vehicle = await vehiclesService.create(data, tenantId);
    return c.json(ResponseUtil.success(vehicle, 'Vehicle created successfully'));
  }

  async update(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdateVehicleRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const vehicle = await vehiclesService.update(id, data, tenantId);
    return c.json(ResponseUtil.success(vehicle, 'Vehicle updated successfully'));
  }

  async delete(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const result = await vehiclesService.delete(id, tenantId);
    return c.json(ResponseUtil.success(result, 'Vehicle deleted successfully'));
  }
}

export const vehiclesController = new VehiclesController();
