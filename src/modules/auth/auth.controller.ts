import type { Context } from 'hono';
import { authService } from './auth.service.ts';
import { LoginRequestSchema } from './dto/login.request.dto.ts';
import { ResponseUtil } from '../../utils/response.ts';

class AuthController {
  async login(c: Context) {
    const body = await c.req.json();
    const data = LoginRequestSchema.parse(body);
    const result = await authService.login(data);
    return c.json(ResponseUtil.success(result));
  }
}

export const authController = new AuthController();
