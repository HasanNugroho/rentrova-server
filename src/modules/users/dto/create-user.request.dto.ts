import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['STAFF', 'DRIVER']),
});

export type CreateUserRequestDto = z.infer<typeof CreateUserRequestSchema>;
