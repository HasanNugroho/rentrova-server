import { z } from 'zod';

export const CreateTenantRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  subscriptionPlan: z.enum(['BASIC', 'PRO', 'ENTERPRISE']).default('BASIC'),
});

export type CreateTenantRequestDto = z.infer<typeof CreateTenantRequestSchema>;
