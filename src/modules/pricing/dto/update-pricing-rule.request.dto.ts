import { z } from 'zod';
import { CreatePricingRuleRequestSchema } from './create-pricing-rule.request.dto.ts';

export const UpdatePricingRuleRequestSchema = CreatePricingRuleRequestSchema.partial();
export type UpdatePricingRuleRequestDto = z.infer<typeof UpdatePricingRuleRequestSchema>;
