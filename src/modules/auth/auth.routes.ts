import { Hono } from 'hono';
import { authController } from './auth.controller.ts';

const authRouter = new Hono();

authRouter.post('/login', (c) => authController.login(c));

export { authRouter };
