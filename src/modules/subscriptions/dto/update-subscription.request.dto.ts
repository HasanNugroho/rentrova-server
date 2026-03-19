import { z } from 'zod';

export const UpdateSubscriptionRequestSchema = z.object({
  plan: z.enum(['BASIC', 'PRO', 'ENTERPRISE']).optional(),
  status: z.enum(['TRIAL', 'ACTIVE', 'EXPIRED']).optional(),
  endDate: z.string().datetime().optional(),
});

export type UpdateSubscriptionRequestDto = z.infer<typeof UpdateSubscriptionRequestSchema>;
