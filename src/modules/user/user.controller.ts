import type { Context } from 'hono';
import { userService } from './user.service.ts';
import { ResponseUtil } from '../../common/utils/response.util.ts';
import { HttpStatus } from '../../common/constants/index.ts';
import type { CreateUserDto, UpdateUserDto } from './user.validation.ts';

export class UserController {
  async findAll(c: Context) {
    const page = c.req.query('page');
    const limit = c.req.query('limit');

    const result = await userService.findAll({ page: Number(page), limit: Number(limit) });

    return c.json(
      ResponseUtil.success(result.data, 'Users retrieved successfully', result.meta),
      HttpStatus.OK,
    );
  }

  async findById(c: Context) {
    const id = c.req.param('id');
    const user = await userService.findById(id);

    return c.json(ResponseUtil.success(user, 'User retrieved successfully'), HttpStatus.OK);
  }

  async create(c: Context) {
    const body = await c.req.json<CreateUserDto>();
    const user = await userService.create(body);

    return c.json(ResponseUtil.created(user, 'User created successfully'), HttpStatus.CREATED);
  }

  async update(c: Context) {
    const id = c.req.param('id');
    const body = await c.req.json<UpdateUserDto>();
    const user = await userService.update(id, body);

    return c.json(ResponseUtil.updated(user, 'User updated successfully'), HttpStatus.OK);
  }

  async delete(c: Context) {
    const id = c.req.param('id');
    await userService.delete(id);

    return c.json(ResponseUtil.deleted('User deleted successfully'), HttpStatus.OK);
  }
}

export const userController = new UserController();
