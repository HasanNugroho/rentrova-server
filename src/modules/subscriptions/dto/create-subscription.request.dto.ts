import { z } from 'zod';

export const CreateSubscriptionRequestSchema = z.object({
  tenantId: z.string().min(1),
  plan: z.enum(['BASIC', 'PRO', 'ENTERPRISE']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export type CreateSubscriptionRequestDto = z.infer<typeof CreateSubscriptionRequestSchema>;
