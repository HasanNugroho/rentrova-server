import type { Context } from 'hono';
import { authService } from './auth.service.ts';
import { ResponseUtil } from '../../common/utils/response.util.ts';
import { HttpStatus } from '../../common/constants/index.ts';
import type { RegisterDto, LoginDto, RefreshTokenDto } from './auth.validation.ts';
import type { JwtPayload } from '../../common/utils/jwt.util.ts';

export class AuthController {
  async register(c: Context) {
    const body = await c.req.json<RegisterDto>();
    const result = await authService.register(body);

    return c.json(ResponseUtil.created(result, 'User registered successfully'), HttpStatus.CREATED);
  }

  async login(c: Context) {
    const body = await c.req.json<LoginDto>();
    const result = await authService.login(body);

    return c.json(ResponseUtil.success(result, 'Login successful'), HttpStatus.OK);
  }

  async refreshToken(c: Context) {
    const body = await c.req.json<RefreshTokenDto>();
    const result = await authService.refreshToken(body.refreshToken);

    return c.json(ResponseUtil.success(result, 'Token refreshed successfully'), HttpStatus.OK);
  }

  async logout(c: Context) {
    const body = await c.req.json<RefreshTokenDto>();
    await authService.logout(body.refreshToken);

    return c.json(ResponseUtil.success(null, 'Logout successful'), HttpStatus.OK);
  }

  async getProfile(c: Context) {
    const user = c.get('user') as JwtPayload;
    const profile = await authService.getProfile(user.userId);

    return c.json(ResponseUtil.success(profile, 'Profile retrieved successfully'), HttpStatus.OK);
  }
}

export const authController = new AuthController();
