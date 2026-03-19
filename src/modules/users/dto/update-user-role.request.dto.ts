import { z } from 'zod';

export const UpdateUserRoleRequestSchema = z.object({
  role: z.enum(['STAFF', 'DRIVER']),
});

export type UpdateUserRoleRequestDto = z.infer<typeof UpdateUserRoleRequestSchema>;
