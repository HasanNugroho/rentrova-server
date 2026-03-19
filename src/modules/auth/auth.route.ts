import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authController } from './auth.controller.ts';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation.ts';
import { authMiddleware } from '../../common/middleware/index.ts';

const authRouter = new Hono();

authRouter.post('/register', zValidator('json', registerSchema), (c) =>
  authController.register(c),
);

authRouter.post('/login', zValidator('json', loginSchema), (c) => authController.login(c));

authRouter.post('/refresh', zValidator('json', refreshTokenSchema), (c) =>
  authController.refreshToken(c),
);

authRouter.post('/logout', zValidator('json', refreshTokenSchema), (c) =>
  authController.logout(c),
);

authRouter.get('/profile', authMiddleware, (c) => authController.getProfile(c));

export { authRouter };
