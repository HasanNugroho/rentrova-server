import { z } from 'zod';

export const MarkPaidRequestSchema = z.object({
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type MarkPaidRequestDto = z.infer<typeof MarkPaidRequestSchema>;
