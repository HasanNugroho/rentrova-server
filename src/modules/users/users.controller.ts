import type { Context } from 'hono';
import { usersService } from './users.service.ts';
import { CreateUserRequestSchema } from './dto/create-user.request.dto.ts';
import { UpdateUserRoleRequestSchema } from './dto/update-user-role.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class UsersController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const users = await usersService.findAll(tenantId);
    return c.json(ResponseUtil.success(users));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateUserRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const user = await usersService.create(data, tenantId);
    return c.json(ResponseUtil.success(user, 'User created successfully'));
  }

  async updateRole(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdateUserRoleRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const user = await usersService.updateRole(id, data, tenantId);
    return c.json(ResponseUtil.success(user, 'User role updated successfully'));
  }

  async delete(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const result = await usersService.delete(id, tenantId);
    return c.json(ResponseUtil.success(result, 'User deleted successfully'));
  }
}

export const usersController = new UsersController();
