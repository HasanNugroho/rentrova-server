import { z } from 'zod';

export const CreatePricingRuleRequestSchema = z.object({
  type: z.enum(['PER_KM', 'PER_DAY', 'DRIVER', 'AREA']),
  value: z.number().positive(),
  description: z.string().optional(),
});

export type CreatePricingRuleRequestDto = z.infer<typeof CreatePricingRuleRequestSchema>;
