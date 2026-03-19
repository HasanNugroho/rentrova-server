import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserIdDto = z.infer<typeof userIdSchema>;
