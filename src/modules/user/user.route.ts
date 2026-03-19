import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userController } from './user.controller.ts';
import { createUserSchema, updateUserSchema, userIdSchema } from './user.validation.ts';
import { authMiddleware, requireRole } from '../../common/middleware/index.ts';

const userRouter = new Hono();

userRouter.use('*', authMiddleware);

userRouter.get('/', (c) => userController.findAll(c));

userRouter.get('/:id', zValidator('param', userIdSchema), (c) => userController.findById(c));

userRouter.post('/', requireRole('ADMIN'), zValidator('json', createUserSchema), (c) =>
  userController.create(c),
);

userRouter.patch(
  '/:id',
  requireRole('ADMIN'),
  zValidator('param', userIdSchema),
  zValidator('json', updateUserSchema),
  (c) => userController.update(c),
);

userRouter.delete('/:id', requireRole('ADMIN'), zValidator('param', userIdSchema), (c) =>
  userController.delete(c),
);

export { userRouter };
