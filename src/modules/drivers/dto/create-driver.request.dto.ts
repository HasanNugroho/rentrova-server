import { z } from 'zod';

export const CreateDriverRequestSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(8),
  licenseNumber: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY']).default('AVAILABLE'),
});

export type CreateDriverRequestDto = z.infer<typeof CreateDriverRequestSchema>;
